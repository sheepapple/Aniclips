import { useEffect, useRef, useState } from "react";
import Clip from "../components/Clip.jsx";
import "../css/Clips.css";
import { searchYouTubeShorts } from "../services/youtubeAPI";

// ============================================================================
// CONSTANTS - Adjust these for testing
// ============================================================================
const INITIAL_LOAD_COUNT = 5;      // How many videoIds to fetch from API initially
const PRELOAD_COUNT = 3;            // How many Clip components to render ahead of active
const LOAD_MORE_THRESHOLD = 2;      // Trigger API call when within 2 clips of end

function Clips() {
    // ========================================================================
    // STATE
    // ========================================================================
    
    // All videoIds we've fetched from the API (this grows as user scrolls)
    const [allVideoIds, setAllVideoIds] = useState([]);
    
    // Which clip is currently active/visible (index in allVideoIds)
    const [activeClipIndex, setActiveClipIndex] = useState(0);
    
    // Loading state - true while fetching from API
    const [loading, setLoading] = useState(true);
    
    // YouTube API pagination token for next batch
    const [nextPageToken, setNextPageToken] = useState('');
    
    // Track if we're currently fetching more (prevents duplicate API calls)
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // ========================================================================
    // REFS
    // ========================================================================
    
    // Store refs to each Clip div so we can observe them
    const clipRefs = useRef([]);

    // ========================================================================
    // INITIAL LOAD - Runs once on component mount
    // ========================================================================
    useEffect(() => {
        loadInitialClips();
    }, []);

    // ========================================================================
    // INTERSECTION OBSERVER - Watches which clip is visible
    // ========================================================================
    useEffect(() => {
        // Don't set up observer until we have clips loaded
        if (allVideoIds.length === 0) return;

        // Create observer that triggers when a clip is 50% visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // When a clip becomes visible (50%+ in viewport)
                    if (entry.isIntersecting) {
                        // Find which index this clip is
                        const index = clipRefs.current.indexOf(entry.target);
                        
                        if (index !== -1 && index !== activeClipIndex) {
                            console.log(`Clip ${index} is now active`);
                            setActiveClipIndex(index);
                            
                            // Check if we need to load more videoIds from API
                            checkAndLoadMore(index);
                        }
                    }
                });
            },
            { 
                threshold: 0.5,  // Trigger when 50% visible
                root: null       // Use viewport as root
            }
        );

        // Observe all currently rendered clips
        clipRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        // Cleanup: disconnect observer when component unmounts or clips change
        return () => observer.disconnect();
    }, [allVideoIds, activeClipIndex]);

    // ========================================================================
    // API FUNCTIONS
    // ========================================================================

    /**
     * Initial load - fetches first batch of videoIds
     * Only called once on mount
     */
    const loadInitialClips = async () => {
        console.log('Loading initial clips...');
        setLoading(true);

        try {
            const { videos, nextPageToken: newToken } = await searchYouTubeShorts(
                'anime shorts',
                '' // Empty string = first page
            );
            
            console.log(`Loaded ${videos.length} initial videos`);
            setAllVideoIds(videos);
            setNextPageToken(newToken || '');
        } catch (error) {
            console.error('Failed to load initial clips:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load more videoIds from API when user is running out
     * @param {number} currentIndex - The index the user is currently viewing
     */
    const checkAndLoadMore = async (currentIndex) => {
        // Calculate how close user is to the end of loaded videoIds
        const remainingClips = allVideoIds.length - currentIndex;
        
        // If within threshold AND we have a next page token AND not already fetching
        const shouldLoadMore = 
            remainingClips <= LOAD_MORE_THRESHOLD && 
            nextPageToken && 
            !isFetchingMore;

        if (shouldLoadMore) {
            console.log(`User is ${remainingClips} clips from end. Loading more...`);
            setIsFetchingMore(true);

            try {
                const { videos, nextPageToken: newToken } = await searchYouTubeShorts(
                    'anime shorts',
                    nextPageToken
                );
                
                console.log(`Loaded ${videos.length} more videos`);
                // Append new videos to existing array
                setAllVideoIds(prev => [...prev, ...videos]);
                setNextPageToken(newToken || '');
            } catch (error) {
                console.error('Failed to load more clips:', error);
            } finally {
                setIsFetchingMore(false);
            }
        }
    };

    // ========================================================================
    // CALCULATE WHICH CLIPS TO RENDER
    // ========================================================================
    
    // Only render from activeClipIndex to activeClipIndex + PRELOAD_COUNT
    // This keeps the DOM light and prevents all videos from loading at once
    const startIndex = activeClipIndex;
    const endIndex = Math.min(activeClipIndex + PRELOAD_COUNT + 1, allVideoIds.length);
    const clipsToRender = allVideoIds.slice(startIndex, endIndex);

    console.log(`Rendering clips ${startIndex} to ${endIndex - 1} of ${allVideoIds.length} total`);

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="clips">
            {loading ? (
                // Show loading state until initial clips are fetched
                <div className="clips-loading">
                    <h3>Loading clips...</h3>
                </div>
            ) : allVideoIds.length === 0 ? (
                // Show empty state if API returned no results
                <div className="clips-empty">
                    <h3>No clips found.</h3>
                </div>
            ) : (
                // Main clips container - only renders when we have clips
                <div className="clips-container">
                    <div className="clips-content">
                        {clipsToRender.map((clip, renderIndex) => {
                            // Calculate the actual index in allVideoIds array
                            const actualIndex = startIndex + renderIndex;
                            
                            return (
                                <div
                                    key={clip.id}
                                    ref={(el) => (clipRefs.current[actualIndex] = el)}
                                    className="clip-wrapper"
                                >
                                    <Clip
                                        clip={clip}
                                        isActive={actualIndex === activeClipIndex}
                                    />
                                </div>
                            );
                        })}
                        
                        {/* Show loading indicator when fetching more */}
                        {isFetchingMore && (
                            <div className="loading-more">
                                Loading more clips...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Clips;