# Aniclips

**A TikTok-style social media platform for discovering Anime and Manga through short-form content**

Aniclips reimagines anime discovery by combining the engaging scroll experience of modern social media with community-driven content curation. Built as a full-stack learning project to master industry-standard web development tools.

![Aniclips Banner](./assets/banner.png)

## Inspiration and Idea

The anime community has always thrived on sharing memorable moments - iconic scenes, emotional highlights, and jaw-dropping animation sequences. However, discovering new anime often requires sifting through long-form reviews, trailers, or entire episodes. Aniclips bridges this gap by creating a platform where users can:

- **Discover anime through bite-sized content** - Short clips that capture the essence of a show
- **Engage with diverse content formats** - From video clips to community discussions
- **Connect with like-minded fans** - Through subcommunities organized by genre, studio, or theme
- **Stay updated on the industry** - Through integrated news boards and trending content

The platform draws inspiration from TikTok's addictive scroll mechanics while tailoring the experience specifically for anime enthusiasts. Whether you're a seasoned otaku or just starting your anime journey, Aniclips helps you find your next favorite show through authentic community recommendations.

## Features

**Note: This project is actively under development. Features marked with 🚧 are in progress.**

### Clips Feed (In Development 🚧)
![Clips Feed](./assets/clips-feed.png)

TikTok-style vertical scrolling feed featuring anime clips pulled from YouTube. Users can:
- Scroll through curated short-form anime content
- Like, comment, and share favorite clips
- Discover new series through algorithmic recommendations
- Filter by genre, studio, release year, and popularity

**Current Status:** Building the core scroll mechanics with YouTube API integration and IntersectionObserver for seamless playback.

### Threads & Discussions (Planned)
Community-driven discussion boards where users can:
- Create and participate in anime-related conversations
- Share opinions, theories, and recommendations
- Upvote quality discussions and helpful posts
- Follow threads on specific shows or topics

### News Boards (Planned)
Aggregated anime industry news featuring:
- Latest announcements and releases
- Studio updates and production news
- Manga adaptations and licensing announcements
- Community-curated news sources

### Subcommunities (Planned)
Organized communities around:
- Specific anime genres (Shounen, Seinen, Isekai, etc.)
- Studios and creators (MUFASA, Kyoto Animation, etc.)
- Themes and topics (Best OSTs, Hidden Gems, etc.)
- Seasonal discussions and watch parties

### User Features (Planned)
- Personalized content recommendations
- Custom watchlists and favorites
- User profiles with activity history
- Follow system and social connections

## Tech Stack

### Frontend
- **React** - Component-based UI architecture
- **JavaScript (ES6+)** - Core application logic
- **HTML5/CSS3** - Semantic markup and responsive styling
- **Vite** - Fast development build tool

### Backend (Planned)
- **Firebase** - Authentication and real-time database
- **MongoDB** - Primary database for user data and content metadata
- **Node.js/Express** - API server and backend logic

### APIs & Services
- **YouTube Data API v3** - Fetching anime clips and metadata
- **Cloudflare Workers** - API request optimization and rate limiting

### Development Tools
- **Git/GitHub** - Version control and collaboration
- **VS Code** - Primary development environment
- **ESLint** - Code quality and consistency
- **Chrome DevTools** - Debugging and performance monitoring

## Screenshots

### Homepage
![Homepage](./assets/homepage.png)
*Landing page with featured content and navigation*

### Clips Interface
![Clips UI](./assets/clips-interface.png)
*Vertical scroll feed with playback controls and engagement options*

### Development Progress
![Code Structure](./assets/code-structure.png)
*Current project architecture and component organization*

## Development Journey

I'm actively documenting my full development process, challenges, and learning experiences in a detailed journal. This includes:
- Technical decisions and architecture choices
- API integration challenges and solutions
- UI/UX iterations and design thinking
- Performance optimization strategies
- Lessons learned from industry-standard tools

**Read the full development journal:** [Google Docs Link](https://docs.google.com/document/d/1NbQgXaYAVdW2hY_QMML44Yp2GjB2HNCGIhLuJFActqY/edit?usp=sharing)

## Roadmap

### Phase 1: Core Features (Current)
- [x] Project setup and architecture
- [x] YouTube API integration
- [ ] Clips feed with scroll mechanics
- [x] Video playback controls
- [ ] Basic UI/UX implementation

### Phase 2: User Experience
- [ ] User authentication (Firebase)
- [ ] Like and comment functionality
- [ ] Personalized recommendations
- [ ] Responsive mobile design

### Phase 3: Community Features
- [ ] Threads and discussion boards
- [ ] Subcommunities
- [ ] User profiles and following
- [ ] Content moderation tools

### Phase 4: Advanced Features
- [ ] News aggregation system
- [ ] Advanced search and filtering
- [ ] Content upload by users
- [ ] Analytics and insights

## Learning Objectives

This project serves as a comprehensive learning experience for modern web development:

**Frontend Development**
- React component lifecycle and hooks
- State management patterns
- API integration and data fetching
- Responsive design principles
- Performance optimization

**Backend Development**
- Firebase authentication and security
- MongoDB schema design and queries
- RESTful API design
- Rate limiting and caching strategies

**DevOps & Tools**
- Git workflow and version control
- Environment configuration
- Build optimization
- Deployment strategies

## Challenges & Solutions

### YouTube API Rate Limiting
**Challenge:** Limited daily quota for API requests
**Solution:** Implementing Cloudflare Workers for request caching and optimized batch fetching

### Infinite Scroll Performance
**Challenge:** Managing multiple video players and DOM elements
**Solution:** Using IntersectionObserver for lazy loading and unloading off-screen content

### Video Autoplay
**Challenge:** Browser autoplay policies and user experience
**Solution:** Strategic use of muted autoplay with visibility detection

## Contributing

This is primarily a personal learning project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature suggestions
- Share ideas for improving the user experience
- Provide feedback on code architecture

## Author

**Alex Mizrahi**
- Aspiring Full-stack Developer & Anime Enthusiast
- [GitHub](https://github.com/sheepapple)
- [Website](https://sheepapple.net)
- [LinkedIn](https://linkedin.com/in/alexandermizrahi)

## Acknowledgments

- YouTube Data API for content integration
- React community for excellent documentation
- Anime community for inspiration and feedback
- All the studios creating amazing content worth sharing

---

**Status:** Active Development | Last Updated: January 2025

**Note:** This is an educational project created for learning purposes. All anime content is sourced from YouTube and remains the property of respective copyright holders.
