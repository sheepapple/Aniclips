import "../css/Clips.css"
import Clip from "../components/Clip.jsx"
import { useState, useEffect } from "react";
import { getClips } from "../services/appStorage";

function Clips({ }) {
    const [clips, setClips] = useState([]);
    const [loading, setLoading] = useState();

    useEffect(() => {
        const loadClips = () => {
            setLoading(true);
            try {
                setClips( getClips() );
            } catch (err) {
                console.log("Failed to load clips...");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        loadClips();
    }, []);

    return (
        <div className="clips-container">
            {console.log("clips in return:", clips)}
            <div className="clips-content">
                {clips.map((clip) => (
                    <Clip clip={clip} key={clip.id} />
                ))}
            </div>
            <div className="clips-content">content.</div>
        </div>
    )
}

export default Clips