
import mockData from "./output.json";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

export const searchYouTubeShorts = async (query, pageToken = '') => {
    try {
        return {
            videos: mockData.data.items.map(item => ({
                id: item.id.videoId,
                youtubeId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high_url,
                channelTitle: item.snippet.channelTitle
            })),
            nextPageToken: mockData.data.nextPageToken
        }
    } catch (error) {
        console.error('YouTube API error:', error)
        return { videos: [], nextPageToken: null }
    }
}