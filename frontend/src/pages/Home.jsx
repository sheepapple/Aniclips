import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { getPopularAnime, searchAnime } from "../services/api";
import "../css/Home.css";
function Home({}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animes, setAnimes] = useState([]);
  /*
    const movies = [
        {id: 1, title: "John Wick", release_date: "2020"},
        {id: 2, title: "Rip Brah", release_date: "2025"}
    ]
    */

  //const movies = getPopular; //dont fetch repeatedly!!

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("bruh");
    const loadPopularAnime = async () => {
      try {
        const popularAnime = await getPopularAnime();
        setAnimes(popularAnime);
      } catch (err) {
        setError("Failed to load animes...");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadPopularAnime();
  }, []); //dependency array

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading) return 
    if (!searchQuery.trim()) return
    setLoading(true)
    try{
        const searchResults = await searchAnime(searchQuery);
        setAnimes(searchResults)
        setError(null)
    } catch (error) {
        setErorr("Failed to search movies...")
        console.log(error);
    } finally {
        setLoading(false);
    }
    console.log("searching");
    //setSearchQuery("sybau") //can empty search or not
  };

  return (
    <div className="Home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

        {error && <div className="error-message">(error)</div>}
      {loading ? (
        <div className="loading">Loading...</div> //if loading display loading 
      ) : ( //else display grid
        <div className="movies-grid">
          {animes.map((movie) => (
            <MovieCard movie={movie} key={movie.mal_id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
