import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Favorites.css";

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites) {
        return (
            <div className="favorites"> <h2>Your Favorites</h2>
                <div className="movies-grid">
                    {favorites.map((movie) => (
                        <MovieCard movie={movie} key={movie.mal_id} />
                    ))}
                </div>
            </div>
        );
    }
    else {
        return <div className="favorites-empty">
            <h2>No Favorite Movies Yet</h2>
            <p>Start adding favorites for them to appear here.</p>
        </div>
    }


}

export default Favorites