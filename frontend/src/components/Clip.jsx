import { useEffect, useRef, useState } from 'react';
import "../css/Clip.css";

function Clip({ clip }) {

    const iframeRef = useRef(null)

    const videoRef = useRef(null)
    const [paused, setPaused] = useState(false);
    const [liked, setLiked] = useState(false);


    // YouTube iframe will auto-play when in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!iframeRef.current) return

                // You can send commands to iframe but it's limited
                // For full control, you'd need YouTube IFrame API
            },
            { threshold: 0.5 }
        )

        if (iframeRef.current) {
            observer.observe(iframeRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div className="clip">
            <iframe
                ref={iframeRef}
                className="clip-video"
                src={`https://www.youtube.com/embed/${clip.youtubeId}?autoplay=1&controls=0&loop=1&playlist=${clip.youtubeId}&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media"
                allowFullScreen
            />

            <div className="clip-overlay">
                {/* Your overlay UI */}
            </div>

            <div className="clip-actions">
                <button className="like-btn">
                    ❤️
                    <span className="action-count">1.2K</span>
                </button>
                <button className="comment-btn">
                    💬
                    <span className="action-count">234</span>
                </button>
                <button className="share-btn">
                    📤
                    <span className="action-count">89</span>
                </button>
            </div>

            <div className="clip-info">
                <div>
                    <h3>{clip.title || "null"}</h3>
                    <p>{clip.description || "null"}</p>
                </div>
                <h4 className="clip-anime">{clip.anime || "null"}</h4>
            </div>
        </div>
    )
}

export default Clip;

/*
useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!videoRef.current) return () => observer.disconnect();

            if (entry.isIntersecting) {
                videoRef.current?.play()
            } else {
                videoRef.current.currentTime = 0;
                videoRef.current?.pause()
            }
        },
        { threshold: 0.9 }
    )

    if (videoRef.current) {
        observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
}, [])

useEffect(() => {
    if (!videoRef.current) return;
    if (paused) {

        videoRef.current?.pause();
    } else { 
        videoRef.current?.play();
    }
}, [paused]);

function onPause(e) {
e.preventDefault();
console.log("clicked!");
setPaused(prev => !prev);

}

function onActionClick(e) {
e.preventDefault();
const div = e.currentTarget;
console.log(div.className);
if (div.className === "like-btn") {
    console.log("liked!");
    (liked) ? setLiked(false) : setLiked(true);
}
}

return (
<div className="clip">
    <div className="clip-overlay">
        <button className="clip-pause-btn" onClick={onPause}>
            {paused ?
                <img src="pauseBtnSVG.svg" alt="Pause button for clips" width="80%" height="80%" />
                : <img src="playBtnSVG.svg" alt="Play button for clips" width="80%" height="80%" />}
        </button>
        <div className="clip-actions">
            <button className="like-btn" onClick={onActionClick}>
                {liked ? 
                    <img src="heartBtnFillSVG.svg" alt="Liked button for clips" width="80%" height="80%" />
                    : <img src="heartBtnSVG.svg" alt="Like button for clips" width="80%" height="80%"/>
                    }
                <span className="action-count">72.7K</span>
            </button>
            <button className="comment-btn">
                <img src="commentBtnSVG.svg" alt="Comment button for clips" width="80%" height="80%" />
                <span className="action-count">6.7K</span>
            </button>
            <button className="share-btn">
                <img src="shareBtnSVG.svg" alt="Share button for clips" width="80%" height="80%" />
                <span className="action-count">2.1K</span>
            </button>
        </div>
    </div>
    <video className="clip-video"
        ref={videoRef}
        src={clip.url}
        loop
        playsInline
    />
    <div className="clip-info">
        <h3>{(clip.title) ? clip.title : "null"}</h3>
        <p>{(clip.description) ? clip.description : "null"}</p>
        <h4 className="clip-anime">{(clip.anime) ? clip.anime : "null"}</h4>
    </div>
</div>
);
}

export default Clip;
*/
