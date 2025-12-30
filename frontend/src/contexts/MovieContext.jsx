//Contexts for making certain information globally available

import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => { //children is a reserved prop
//when you write a compoennt and children are anything that inside of the rendered component
    const [favorites, setFavorites] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    //Local storage allows us to stores values directly within our browser
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")
        //Local storage can only store strings so convert to Array from JSON
        if (storedFavs) setFavorites(JSON.parse(storedFavs)) 
        setIsLoaded(true);
        console.log("loading favorites from local storage")
    }, [])

    useEffect(() => {
        //Every time a favorite is added/unadded (when it changes), then we update LocalStorage
        //console.log("saving to local storage");
        //console.log(JSON.stringify(favorites));
        if (isLoaded)
            localStorage.setItem("favorites", JSON.stringify(favorites))
        console.log("Saving to Favorites:")
        console.log(JSON.stringify(favorites))
        
    }, [favorites])

    const addToFavorites = (movie) => {
        console.log("addToFavorites")
        setFavorites(prev => [...prev, movie]) //the ... "spreads" the array
    }

    const removeFromFavorites = (movieId) => {
        console.log("removeFromFavorites")
        setFavorites(prev => prev.filter(movie => movie.mal_id !== movieId))
    }

    const isFavorite = (movieId) => {
        //Checks favs and sees if query is a fav
        const favAnime = favorites.some(movie => movie.mal_id === movieId);
        if (favorites.some(movie => movie.mal_id === movieId)) {
           // console.log("movieId:")
            //console.log(movieId)
        }
        return favorites.some(movie => movie.mal_id === movieId) 
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    //Creates context that allows anything inside children can access all values in value object
    return <MovieContext.Provider value={value}> 
        {children}
    </MovieContext.Provider>
}