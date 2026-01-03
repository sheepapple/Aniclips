import "../css/Clip.css"
import { useRef, useEffect } from 'react'

function Clip({ clip }) {

    const videoRef = useRef(null)

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

    return (
        <div className="clip">
            <video className="clip-video"
                ref={videoRef}
                src={clip.url}
                loop
                muted
                playsInLine
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