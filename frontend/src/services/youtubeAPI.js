import axios from 'axios'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

export const searchYouTubeShorts = async (query, pageToken = '') => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                videoDuration: 'short',
                maxResults: 10,
                pageToken, pageToken,
                key: API_KEY
            }
        })
        return {
            videos: response.data.items.map(item => ({
                id: item.id.videoId,
                youtubeId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high_url,
                channelTitle: item.snippet.channelTitle
            })),
            nextPageToken: response.data.nextPageToken
        }
    } catch (error) {
        console.error('YouTube API error:', error)
        return { videos: [], nextPageToken: null }
    }
}