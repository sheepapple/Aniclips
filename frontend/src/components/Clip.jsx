import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import "../css/Clip.css";

import CommentIcon from "../assets/commentBtnSVG.svg";
import HeartIconFill from "../assets/heartBtnFillSVG.svg";
import HeartIcon from "../assets/heartBtnSVG.svg";
import PauseIcon from "../assets/pauseBtnSVG.svg";
import PlayIcon from "../assets/playBtnSVG.svg";
import ShareIcon from "../assets/shareBtnSVG.svg";


const Clip = forwardRef(function Clip({ clip }, ref) {
    const wrapperRef = useRef(null);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const [paused, setPaused] = useState(false);
    const [liked, setLiked] = useState(false);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!window.YT || !window.YT.Player) return;

        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: clip.youtubeId,
            playerVars: {
                autoplay: 0,
                mute: 0,
                controls: 0,
                loop: 1,
                playlist: clip.youtubeId,
                modestbranding: 1,
                playsinline: 1
            }
        });

        return () => {
            playerRef.current?.destroy();
        };
    }, [clip.youtubeId]);

    useEffect(() => {
        if (!playerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // only toggle local "active" flag here — parent will control play/pause
                setActive(Boolean(entry.isIntersecting && entry.intersectionRatio >= 0.5));
            },
            { threshold: 0.5 }
        );

        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    // Expose getters and dom node to parent via ref (parent will call these)
    useImperativeHandle(ref, () => ({
        getState: () => ({ paused, liked, active }),
        getMeta: () => ({ id: clip.id, youtubeId: clip.youtubeId, title: clip.title }),
        getDom: () => wrapperRef.current,
        play: () => {
            if (playerRef.current?.playVideo) {
                try { playerRef.current.playVideo(); } catch {}
                setPaused(false);
                setActive(true);
            }
        },
        pause: () => {
            if (playerRef.current?.pauseVideo) {
                try { playerRef.current.pauseVideo(); } catch {}
                setPaused(true);
                setActive(false);
            }
        }
    }), [paused, liked, active, clip]);

    function onPause(e) {
        e.preventDefault();
        const player = playerRef.current;
        if (!player) return;

        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
            player.pauseVideo();
            setPaused(true);
        } else {
            player.playVideo();
            setPaused(false);
        }
    }

    function onActionClick(e) {
        e.preventDefault();
        if (e.currentTarget.className === "like-btn") {
            setLiked(v => !v);
        }
    }

    return (
        <div className="clip" ref={wrapperRef}>
            <div className="clip-overlay">
                <button className="clip-pause-btn" onClick={onPause}>
                    {paused ?
                        <img src={PauseIcon} alt="Pause" width="80%" height="80%" />
                        : <img src={PlayIcon} alt="Play" width="80%" height="80%" />}
                </button>
                <div className="clip-actions">
                    <button className="like-btn" onClick={onActionClick}>
                        {liked ?
                            <img src={HeartIconFill} alt="Liked" width="80%" height="80%" />
                            : <img src={HeartIcon} alt="Like" width="80%" height="80%" />
                        }
                        <span className="action-count">72.7K</span>
                    </button>
                    <button className="comment-btn">
                        <img src={CommentIcon} alt="Comment" width="80%" height="80%" />
                        <span className="action-count">6.7K</span>
                    </button>
                    <button className="share-btn">
                        <img src={ShareIcon} alt="Share" width="80%" height="80%" />
                        <span className="action-count">2.1K</span>
                    </button>
                </div>
            </div>

            <div ref={containerRef} className="clip-video" />

            <div className="clip-info">
                <div>
                    <h3>{clip.title ?? ""}</h3>
                    <p>{clip.description ? clip.description.substring(0, 100) : ""}</p>
                </div>
                <h4 className="clip-anime">{clip.channelTitle ?? ""}</h4>
            </div>
            <div className="debug-info">
                <h3>paused: {paused ? "true" : "false"} </h3>
                <h3>liked: {liked ? "true" : "false"}</h3>
                <h3>active: {active ? "true" : "false"}</h3>
            </div>
        </div>
    );
});

export default Clip;