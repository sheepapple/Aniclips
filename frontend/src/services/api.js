const API_KEY = "";
const BASE_URL = "https://api.jikan.moe/v4";

export const getPopularAnime = async () => {
    console.log("getting popularanime")
    const response = await fetch(`${BASE_URL}/top/anime`); 
    const raw = await response.json();
    console.log(raw.data)
    return raw.data;
};

export const searchAnime = async (query) => {
    console.log(query)
    const response = await fetch(`${BASE_URL}/anime?q=${query}`); 
    const raw = await response.json();
    console.log("search results:")
    console.log(raw.data)
    return raw.data;
};

