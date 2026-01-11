import { useEffect, useRef, useState } from 'react';
import "../css/Clip.css";

function Clip({ clip }) {

    const iframeRef = useRef(null)

    //const videoRef = useRef(null)
    const [paused, setPaused] = useState(false);
    const [liked, setLiked] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                /*
                if (!iframeRef.current) return () => observer.disconnect();

                if (entry.isIntersecting) {
                    iframeRef.current?.play()
                } else {
                    iframeRef.current.currentTime = 0;
                    iframeRef.current?.pause()
                }*/

                //handled by iframe
            },
            { threshold: 0.9 }
        )

        if (iframeRef.current) {
            observer.observe(iframeRef.current);
        }

        return () => observer.disconnect();
    }, [])

    /*
    useEffect(() => {
        if (!iframeRef.current) return;
        if (paused) {

            iframeRef.current?.pause();
        } else {
            iframeRef.current?.play();
        }
    }, [paused]);
    */

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
                            : <img src="heartBtnSVG.svg" alt="Like button for clips" width="80%" height="80%" />
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
                ref={iframeRef}
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

