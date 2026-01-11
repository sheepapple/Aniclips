import { useEffect, useState, useRef } from "react";
import Clip from "../components/Clip.jsx";
import "../css/Clips.css";
import { searchYouTubeShorts } from "../services/youtubeAPI";

function Clips({ }) {
    const [clips, setClips] = useState([]);
    const [loading, setLoading] = useState();
    const [nextPageToken, setNextPageToken] = useState('')
    const observerTarget = useRef(null)


    useEffect(() => {
        loadClips()
    }, []);

    const loadClips = async (pageToken = '') => {
        if (loading) return
        setLoading(true)

        try {
            const { videos, nextPageToken: newToken } = await searchYouTubeShorts(
                'anime shorts', //search query
                pageToken
            )
            setClips(prev => pageToken ? [...prev, ...videos] : videos)
            setNextPageToken(newToken)
        } catch (error) {
            console.error('Failed to load clips: ', error)
        } finally {
            setLoading(false)
        }
        /*
        try {
            setClips( getClips() );
        } catch (err) {
            console.log("Failed to load clips...");
            console.log(err);
        } finally {
            setLoading(false);
        }*/
    };

    return (
        <div className="clips">
            {clips.length === 0 && !loading ? (
                <div className="clips-empty">
                    <h3>No clips found.</h3>
                </div>
            ) : (
                <div className="clips-container">
                    {console.log("clips in return:", clips)}
                    <div className="clips-content">
                        {clips.map((clip) => (
                            <Clip clip={clip} key={clip.id} />
                        ))}
                        <div ref={observerTarget} style={{ height: '20px' }} />
                        {loading && <div className="loading">Loading more...</div>}
                    </div>
                    <div className="clips-content">content.</div>
                </div>
            )}
        </div>
    )
}

export default Clips