import { useEffect, useRef, useState } from 'react';
import "../css/Clip.css";

/**
 * Clip Component - "Dumb" component that renders a single YouTube video
 * 
 * Props:
 * - clip: Object containing { youtubeId, title, description, channelTitle }
 * - isActive: Boolean from parent (Clips.jsx) telling us if we should play
 */
function Clip({ clip, isActive }) {
    // ========================================================================
    // REFS
    // ========================================================================
    const playerRef = useRef(null);      // YouTube IFrame Player instance
    const containerRef = useRef(null);   // Div where player will be embedded

    // ========================================================================
    // STATE
    // ========================================================================
    const [paused, setPaused] = useState(false);  // User manually paused?
    const [liked, setLiked] = useState(false);    // User liked this clip?
    const [playerReady, setPlayerReady] = useState(false); // Is player loaded?

    // ========================================================================
    // CREATE YOUTUBE PLAYER - Runs once per clip
    // ========================================================================
    useEffect(() => {
        // Make sure YouTube IFrame API is loaded
        if (!window.YT || !window.YT.Player) {
            console.error('YouTube IFrame API not loaded');
            return;
        }

        // Create the player instance
        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: clip.youtubeId,
            playerVars: {
                autoplay: 0,           // Don't autoplay on load
                mute: 1,               // Start muted (required for autoplay)
                controls: 0,           // Hide YouTube controls
                loop: 1,               // Loop the video
                playlist: clip.youtubeId,  // Required for looping
                modestbranding: 1,     // Minimal YouTube branding
                playsinline: 1,        // Play inline on mobile
                rel: 0,                // Don't show related videos
                disablekb: 1           // Disable keyboard controls
            },
            events: {
                // Called when player is fully loaded and ready
                onReady: () => {
                    console.log(`Player ready for: ${clip.youtubeId}`);
                    setPlayerReady(true);
                }
            }
        });

        // Cleanup: destroy player when component unmounts
        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [clip.youtubeId]);

    // ========================================================================
    // RESPOND TO isActive PROP - Play/Pause based on visibility
    // ========================================================================
    useEffect(() => {
        // Don't do anything until player is ready
        if (!playerRef.current || !playerReady) return;

        // Parent (Clips.jsx) tells us we're active → Play (unless user manually paused)
        if (isActive && !paused) {
            console.log(`Playing: ${clip.youtubeId}`);
            playerRef.current.playVideo();
        }
        // Parent tells us we're NOT active → Pause
        else if (!isActive) {
            console.log(`Pausing: ${clip.youtubeId}`);
            playerRef.current.pauseVideo();
        }
    }, [clip.youtubeId, isActive, paused, playerReady]);

    // ========================================================================
    // RESET MANUAL PAUSE when clip becomes inactive
    // ========================================================================
    useEffect(() => {
        // When this clip is no longer active, reset the manual pause state
        // This allows it to autoplay next time it becomes active
        if (!isActive) {
            console.log(`Resetting pause state for: ${clip.youtubeId}`);
            // Use functional update to avoid needing paused in dependencies
            setPaused(prevPaused => {
                if (prevPaused) {
                    console.log('Pause state reset');
                    return false;
                }
                return prevPaused;
            });
        }
    }, [isActive, clip.youtubeId]); // Include clip.youtubeId to satisfy ESLint

    // ========================================================================
    // USER INTERACTION HANDLERS
    // ========================================================================

    /**
     * Handle user clicking the pause/play button overlay
     */
    function handlePauseToggle(e) {
        e.preventDefault();
        if (!playerRef.current || !playerReady) return;

        // Get current player state
        const state = playerRef.current.getPlayerState();

        if (state === window.YT.PlayerState.PLAYING) {
            // Currently playing → Pause it
            playerRef.current.pauseVideo();
            setPaused(true);
            console.log('User paused video');
        } else {
            // Currently paused → Play it
            playerRef.current.playVideo();
            setPaused(false);
            console.log('User resumed video');
        }
    }

    /**
     * Handle like button click
     */
    function handleLikeClick(e) {
        e.preventDefault();
        setLiked(!liked);
        console.log(liked ? 'Unliked' : 'Liked');
    }

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="clip">
            {/* Overlay with controls */}
            <div className="clip-overlay">
                {/* Pause/Play button - covers most of the video */}
                <button className="clip-pause-btn" onClick={handlePauseToggle}>
                    {paused ? (
                        <img
                            src="playBtnSVG.svg"
                            alt="Play button"
                            width="80%"
                            height="80%"
                        />
                    ) : (
                        <img
                            src="pauseBtnSVG.svg"
                            alt="Pause button"
                            width="80%"
                            height="80%"
                        />
                    )}
                </button>

                {/* Action buttons on the right */}
                <div className="clip-actions">
                    {/* Like button */}
                    <button className="like-btn" onClick={handleLikeClick}>
                        {liked ? (
                            <img
                                src="heartBtnFillSVG.svg"
                                alt="Liked"
                                width="80%"
                                height="80%"
                            />
                        ) : (
                            <img
                                src="heartBtnSVG.svg"
                                alt="Like"
                                width="80%"
                                height="80%"
                            />
                        )}
                        <span className="action-count">72.7K</span>
                    </button>

                    {/* Comment button */}
                    <button className="comment-btn">
                        <img
                            src="commentBtnSVG.svg"
                            alt="Comment"
                            width="80%"
                            height="80%"
                        />
                        <span className="action-count">6.7K</span>
                    </button>

                    {/* Share button */}
                    <button className="share-btn">
                        <img
                            src="shareBtnSVG.svg"
                            alt="Share"
                            width="80%"
                            height="80%"
                        />
                        <span className="action-count">2.1K</span>
                    </button>
                </div>
            </div>

            {/* YouTube player embeds here */}
            <div ref={containerRef} className="clip-video" />

            {/* Video info at the bottom */}
            <div className="clip-info">
                <div>
                    <h3>{clip.title || ""}</h3>
                    <p>{clip.description ? clip.description.substring(0, 100) : ""}</p>
                </div>
                <h4 className="clip-anime">{clip.channelTitle || ""}</h4>
            </div>
        </div>
    );
}

export default Clip;