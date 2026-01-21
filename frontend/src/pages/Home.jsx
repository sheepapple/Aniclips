import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularAnime, searchAnime } from "../services/api";


import "../css/Home.css";
function Home() {
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
  const [page, setPage] = useState(1)

  /*
    const loadMore = useCallback(() => {
      console.log("Loading more animes...")
      setPage(prev => prev+1);
      console.log("page:", page);
    }, []);
  
    const observerTarget = useInfiniteScroll(loadMore, loading);
  */

  const addAnimes = (newAnimes) => {
    setAnimes(prev => {
      const existingIds = (prev.map(a => a.mal_id));
      const uniqueNew = newAnimes.filter(a => !existingIds.includes(a.mal_id));
      return [...prev, ...uniqueNew];
    });
  };

  useEffect(() => {
    console.log("loading changed to:", loading)
  }, [loading])

  useEffect(() => {
    const loadPopularAnime = async () => {
      setLoading(true);
      try {
        const popularAnime = await getPopularAnime(page);
        addAnimes(popularAnime);
      } catch (err) {
        setError("Failed to load animes...");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadPopularAnime();
  }, [page]); //dependency array


  useEffect(() => {
    const handleScroll = () => {
      //console.log(loading)
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (scrolledToBottom && loading === false) {
        console.log("loading next page of shit")
        setLoading(true)
        setPage(prev => prev + 1)
        //console.log("reached bottom of list");
      } else {
        //console.log(loading)
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading) return
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const searchResults = await searchAnime(searchQuery);
      setAnimes(searchResults)
      setError(null)
    } catch (error) {
      setErorr("Failed to search movies...")
      console.log(error);
    } finally {
      setLoading(false);
    }
    //console.log("searching");
    //setSearchQuery("sybau") //can empty search or not
  };

  //   <div ref={observerTarget} style={{height: "20px", background: "red"}}></div>
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

      {loading && animes.length === 0 && <h1 className="loading" align="center" >Loading...</h1>}

      {animes.length > 0 && (
        <div className="movies-grid">
          {animes.map((movie) => (
            <MovieCard movie={movie} key={movie.mal_id} />
          ))}
        </div>
      )}

      {loading && animes.length > 0 && (
        <h2 className="loading" align="center">Loading...</h2> //if loading display loading 
      )}

    </div>
  );
}

export default Home;
