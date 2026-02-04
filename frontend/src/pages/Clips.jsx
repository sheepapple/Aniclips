import { useEffect, useRef, useState } from "react";
import Clip from "../components/Clip.jsx";
import "../css/Clips.css";
import { searchYouTubeShorts } from "../services/youtubeAPI";

function Clips() {
    const POOL_THRESHOLD = 2;
    const PRELOAD_COUNT = 2;
    const PRERENDER_COUNT = 1;

    const [apiCalls, setApiCalls] = useState(0);
    const [clipsPool, setClipsPool] = useState([]);
    const [feed, setFeed] = useState([]); // Stores full clip objects
    const [seenIds, setSeenIds] = useState(new Set()); // Track all seen clips
    const [indexById, setIndexById] = useState({});
    const [activeClipId, setActiveClipId] = useState(null);
    const [nextPageToken, setNextPageToken] = useState('');
    const [loading, setLoading] = useState(true);
    const clipComponentRefs = useRef({});
    const observerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        loadClips('', seenIds);
    }, []);

    const loadClips = async (pageToken = '', seenIdsSnapshot = new Set()) => {
        setApiCalls(prev => prev + 1);

        try {
            const { videos, nextPageToken: newToken } = await searchYouTubeShorts(
                'anime shorts',
                pageToken
            );

            if (newToken) setNextPageToken(newToken);

            setClipsPool(prevPool => {
                const idsInPool = new Set(prevPool.map(p => p.id));
                const newItems = videos.filter(v => !idsInPool.has(v.id) && !seenIdsSnapshot.has(v.id));
                return [...prevPool, ...newItems];
            });
        } catch (err) {
            console.error("loadClips error", err);
        } finally {
            setLoading(false);
        }
    };

    const queueClip = (clipObj) => {
        setFeed(prevFeed => {
            const newFeed = [...prevFeed, clipObj];
            const newIndex = newFeed.length - 1;
            
            setIndexById(prev => ({
                ...prev,
                [clipObj.id]: newIndex
            }));

            setSeenIds(prev => {
                const next = new Set(prev);
                next.add(clipObj.id);
                return next;
            });
            
            return newFeed;
        });
    };

    // Set initial active clip
    useEffect(() => {
        if (!activeClipId && feed.length > 0) {
            setActiveClipId(feed[0].id);
        }
    }, [feed.length, activeClipId]);

    // Initialize feed with PRELOAD_COUNT + 1 clips
    useEffect(() => {
        if (feed.length === 0 && clipsPool.length > 0) {
            const needed = PRELOAD_COUNT + 1;
            // take needed clips from pool, add them to feed
            // do this by calling a function called queueClip()
            // which should internally update indexById alongside feed
            for (let i = 0; i < needed && i < clipsPool.length; i++) {
                queueClip(clipsPool[i]);
            }
            setClipsPool(prevPool => prevPool.slice(needed));
        }
    }, [clipsPool]);

    // Automatic pool refill when low
    useEffect(() => {
        if (clipsPool.length <= POOL_THRESHOLD && !loading) {
            loadClips(nextPageToken, seenIds);
        }
    }, [clipsPool.length, loading, nextPageToken, seenIds]);

    // Maintain PRELOAD_COUNT ahead of active clip
    useEffect(() => {
        if (!activeClipId || feed.length === 0) return;
        
        const activeIdx = indexById[activeClipId];
        if (activeIdx === undefined) return;

        const ahead = feed.length - 1 - activeIdx;
        if (ahead < PRELOAD_COUNT && clipsPool.length > 0) {
            //simply call queueClip() to add one clip from pool to feed
            queueClip(clipsPool[0]);
            setClipsPool(prevPool => prevPool.slice(1));
        }
    }, [activeClipId, feed.length, indexById, clipsPool.length]);

    // Get clips to render (active ± PRERENDER_COUNT)
    function getClipsToRender() {

        /*
        //create an empty Clip object
        const clipEmpty = { id: 'empty', youtubeId: '', title: 'Loading...' };

        // Fill with empty clips but make the id the index to ensure uniqueness
        const clips = Array.from({ length: feed.length }, (_, i) => ({
            ...clipEmpty,
            id: `empty-${i}`
        }));

        // Fill in only the active ± PRERENDER_COUNT clips
        if (activeClipId && feed.length > 0) {
            const activeIdx = indexById[activeClipId];
            if (activeIdx !== undefined) {
                const start = Math.max(0, activeIdx - PRERENDER_COUNT);
                const end = Math.min(feed.length - 1, activeIdx + PRERENDER_COUNT);
                
                for (let i = start; i <= end; i++) {
                    clips[i] = feed[i];
                }
            }
        }
        return clips;
        */

        // For now, render all clips
        return feed;
    }

    // IntersectionObserver to detect which clip DOM node becomes active
    useEffect(() => {
        if (!containerRef.current) return;
        observerRef.current = new IntersectionObserver((entries) => {
            let best = null;
            let bestRatio = 0;
            entries.forEach(e => {
                if (e.intersectionRatio > bestRatio) {
                    bestRatio = e.intersectionRatio;
                    best = e;
                }
            });
            if (best && bestRatio > 0.5) {
                const node = best.target;
                const matchId = Object.keys(clipComponentRefs.current).find(id => {
                    const ref = clipComponentRefs.current[id];
                    try {
                        return ref?.getDom && ref.getDom() === node;
                    } catch {
                        return false;
                    }
                });
                if (matchId) setActiveClipId(matchId);
            }
        }, { threshold: [0.25, 0.5, 0.75], root: containerRef.current });

        return () => observerRef.current?.disconnect();
    }, [loading, feed.length, containerRef]);

    useEffect(() => {
        const obs = observerRef.current;
        if (!obs) return;

        obs.disconnect();

        const visibleClips = getClipsToRender();
        visibleClips.forEach(clip => {
            const ref = clipComponentRefs.current[clip.id];
            const dom = ref?.getDom && ref.getDom();
            if (dom) obs.observe(dom);
        });

        return () => obs.disconnect();
    }, [feed, activeClipId, indexById, containerRef]);

    // Play/pause clips based on activeClipId
    useEffect(() => {
        const refs = clipComponentRefs.current || {};
        Object.keys(refs).forEach(id => {
            const c = refs[id];
            if (!c || !c.getDom) return;
            const dom = c.getDom();
            if (id === activeClipId) {
                c.play?.();
                if (dom) dom.dataset.active = "true";
            } else {
                c.pause?.();
                if (dom) dom.dataset.active = "false";
            }
        });
    }, [activeClipId]);

    return (
        <div className="clips">
            <div className="dev-info">

    <h3 className="dev-field">Active Clip ID: {activeClipId}</h3>
    <h3 className="dev-field">Active Index: {indexById[activeClipId] ?? 'N/A'}</h3>
    <h3 className="dev-field">Feed Length: {feed.length}</h3>
    <h3 className="dev-field">Pool Length: {clipsPool.length}</h3>
    <h3 className="dev-field">Rendering: {getClipsToRender().length} clips</h3>
    <h3 className="dev-field">API Calls: {apiCalls}</h3>
            </div>
            {loading && <h1 className="loading" align="center">Loading...</h1>}
            {feed.length === 0 && !loading && (
                <div className="clips-empty">
                    <h3>No clips found.</h3>
                </div>
            )}
            {feed.length > 0 && !loading && (
                <div className="clips-container" ref={containerRef}>
                    <div className="clips-content">
                        {getClipsToRender().map(clip => (
                            <Clip
                                key={clip.id}
                                clip={clip}
                                ref={(r) => { clipComponentRefs.current[clip.id] = r; }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Clips;