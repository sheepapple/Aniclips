import { useEffect, useRef, useState } from "react";
import Clip from "../components/Clip.jsx";
import "../css/Clips.css";
import { searchYouTubeShorts } from "../services/youtubeAPI";

function Clips() {
    const POOL_THRESHOLD = 5;
    const RENDER_WINDOW = 1;

    const [clipsPool, setClipsPool] = useState([]);
    const [queue, setQueue] = useState([]);
    const [activeClipId, setActiveClipId] = useState(null);

    const [loading, setLoading] = useState(true);
    const clipComponentRefs = useRef({});
    const observerRef = useRef(null);
    const containerRef = useRef(null); // <--- add container ref

    useEffect(() => {
        loadClips();
    }, []);

    const loadClips = async (pageToken = '') => {
        setLoading(true);
        try {
            const { videos, nextPageToken: newToken } = await searchYouTubeShorts(
                'anime shorts',
                pageToken
            );
            // Append to pool and to queue (dedupe by id)
            setClipsPool(prevPool => {
                const idsInPool = new Set(prevPool.map(p => p.id));
                const newItems = videos.filter(v => !idsInPool.has(v.id));
                const merged = [...prevPool, ...newItems];
                // update queue too
                setQueue(prevQueue => {
                    const qSet = new Set(prevQueue);
                    const appended = [...prevQueue];
                    newItems.forEach(it => {
                        if (!qSet.has(it.id)) appended.push(it.id);
                    });
                    // if no active set yet, set first available
                    if (!activeClipId && appended.length > 0) {
                        setActiveClipId(appended[0]);
                    }
                    return appended;
                });
                return merged;
            });
        } catch (err) {
            console.error("loadClips error", err);
        } finally {
            setLoading(false);
        }
    };

    // IntersectionObserver to detect which clip DOM node becomes active
    useEffect(() => {
        // wait for container DOM to exist and recreate observer when it changes
        if (!containerRef.current) return;
        observerRef.current = new IntersectionObserver((entries) => {
            // pick the entry with largest intersectionRatio > 0.5
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
    }, [containerRef.current]);

    // Observe only rendered clip DOM nodes (prev/active/next)
    useEffect(() => {
        const obs = observerRef.current;
        if (!obs) return;

        // disconnect first
        obs.disconnect();

        const visibleIds = getVisibleIds();
        visibleIds.forEach(id => {
            const ref = clipComponentRefs.current[id];
            const dom = ref?.getDom && ref.getDom();
            if (dom) obs.observe(dom);
        });

        return () => obs.disconnect();
    }, [queue, activeClipId, containerRef.current]); // include containerRef.current

    // Automatic pool refill when low
    useEffect(() => {
        const remaining = clipsPool.length - queue.length;
        if (remaining <= POOL_THRESHOLD && !loading) {
            loadClips();
        }
    }, [clipsPool.length, queue.length, loading]);

    // ensure first clip becomes active when queue is populated
    useEffect(() => {
        if (!activeClipId && queue.length > 0) {
            setActiveClipId(queue[0]);
        }
    }, [queue, activeClipId]);

    // when activeClipId changes, tell children to play/pause and mark data-active for CSS
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

    function getVisibleIds() {
        if (!queue || queue.length === 0) return [];
        const idx = Math.max(0, queue.indexOf(activeClipId));
        const ids = [];
        for (let offset = -RENDER_WINDOW; offset <= RENDER_WINDOW; offset++) {
            const i = idx + offset;
            if (i >= 0 && i < queue.length) ids.push(queue[i]);
        }
        // ensure uniqueness and preserve order
        return Array.from(new Set(ids));
    }

    // helper to lookup clip object by id from pool
    function clipById(id) {
        return clipsPool.find(c => c.id === id) || null;
    }

    return (
        <div className="clips">
            <h3 className="dev-info">queue.length: {queue.length}</h3>
            <h3 className="dev-info">activeClipId: {activeClipId}</h3>
            {loading && <h1 className="loading" align="center">Loading...</h1>}
            {(!queue || queue.length === 0) && !loading && (
                <div className="clips-empty">
                    <h3>No clips found.</h3>
                </div>
            )}
            {queue.length !== 0 && !loading && (
                <div className="clips-container" ref={containerRef}>
                    <div className="clips-content">
                        {
                            // render only prev/active/next based on queue
                            getVisibleIds().map(id => {
                                const clip = clipById(id);
                                if (!clip) return null;
                                return (
                                    <Clip
                                        key={clip.id}
                                        clip={clip}
                                        ref={(r) => { clipComponentRefs.current[clip.id] = r; }}
                                    />
                                );
                            })
                        }
                    </div>
                    <div className="clips-content">content.</div>
                </div>
            )}
        </div>
    );
}

export default Clips;