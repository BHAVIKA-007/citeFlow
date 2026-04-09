# 📚 Citation Manager - Frontend

A production-ready React + Vite frontend for a MERN stack Research Paper Management System.

## 🎯 Features

✅ **Authentication**
- User registration with avatar upload
- Secure login/logout
- Token-based authentication with localStorage

✅ **Dashboard**
- Real-time statistics (total papers, topics, favorites, notes)
- Quick overview of research activity

✅ **Topics Management**
- Create research topics
- Delete topics
- View papers organized by topics
- Paper count per topic

✅ **Papers Management**
- Browse all research papers
- Search papers by title/author
- Filter by topic
- Sort by title or year
- Mark papers as favorites/unfavorites
- View paper details

✅ **Paper Details**
- Comprehensive paper information (authors, year, journal, topic)
- PDF viewer/link
- Add and manage notes with timestamps
- Add and manage highlights
- Toggle favorite status

✅ **Favorites**
- View all bookmarked papers
- Remove papers from favorites
- Same filtering and sorting as main papers list

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js                 # Axios instance with interceptors
│   │   └── services/
│   │       ├── userService.js       # Auth APIs
│   │       ├── paperService.js      # Paper APIs
│   │       ├── noteService.js       # Note APIs
│   │       ├── highlightService.js  # Highlight APIs
│   │       ├── researchTopicService.js
│   │       ├── dashboardService.js
│   │       └── ...
│   ├── components/
│   │   ├── Layout.jsx               # Main layout wrapper
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── Sidebar.jsx              # Side navigation
│   │   ├── PaperCard.jsx            # Paper card component
│   │   ├── TopicCard.jsx            # Topic card component
│   │   └── DashboardCard.jsx        # Stats card component
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Dashboard.jsx            # Dashboard page
│   │   ├── Topics.jsx               # Topics management
│   │   ├── Papers.jsx               # Papers listing
│   │   ├── PaperDetails.jsx         # Paper details with notes/highlights
│   │   ├── Favorites.jsx            # Favorites listing
│   │   └── Notes.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx            # React Router configuration
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   └── style.css                    # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Backend server running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

The API base URL is configured in [src/api/axios.js](src/api/axios.js):
```javascript
const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true
});
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎨 UI Design Features

### Clean, Modern Design
- Gradient primary colors (#667eea → #764ba2)
- Smooth transitions and hover effects
- Card-based layout system
- Responsive design for different screen sizes

### Components Used
- **Sidebar**: Fixed navigation with active state highlighting
- **Navbar**: Dynamic page title and user profile dropdown
- **Cards**: Reusable card components for papers, topics, and stats
- **Forms**: Clean form inputs with validation feedback
- **Modals**: Alert and confirmation modals
- **Empty States**: User-friendly empty state messages

## 📱 Key Pages

### Login / Register
- Email and password inputs
- Optional avatar upload during registration
- Form validation with error messages
- Redirect to dashboard on success

### Dashboard
- 4 stat cards showing key metrics
- Visual indicators with emojis
- Quick stats section
- Loading states

### Topics
- Add new topic form
- Grid of topic cards
- Delete functionality with confirmation
- Paper count per topic

### Papers
- Search bar for title/author
- Topic filter dropdown
- Sort options (by title, year)
- Grid of paper cards
- Empty state handling

### Paper Details
- Full paper information display
- PDF link/viewer
- Notes section with add/delete
- Highlights section with add/delete
- Favorite toggle
- Timestamps for notes and highlights

### Favorites
- Filtered view of favorite papers
- Same card layout as main papers page
- Toggle removal from favorites
- Empty state when no favorites

## 🔑 Key Features Implementation

### Authentication
- Login/Register pages with form validation
- Token stored in localStorage
- Axios interceptor adds token to all requests
- Logout clears token and redirects to login

### API Integration
- Centralized API calls in service files
- Error handling with user-friendly messages
- Loading states for async operations
- Data caching where appropriate

### State Management
- React hooks (useState, useEffect)
- Props drilling for component communication
- Context API ready (can be expanded)

### Styling
- Global CSS with semantic class names
- Responsive flexbox and grid layouts
- Smooth animations and transitions
- Dark text on light backgrounds for accessibility

## 🚀 Performance Optimizations

- Lazy loading with React.StrictMode
- Conditional rendering to prevent unnecessary DOM updates
- Event delegation in components
- Optimized CSS with minimal repaints
- Axios caching through service layer

## 🔐 Security Features

- Token-based authentication
- CORS enabled with credentials
- Secure axios interceptor
- Form validation
- XSS protection through React's built-in sanitization

## 🐛 Error Handling

- Try-catch blocks in async operations
- User-friendly error messages
- Loading states during data fetching
- Validation feedback in forms
- Error alerts on pages

## 📊 API Endpoints Used

The frontend communicates with the following backend endpoints:

### Users
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user
- `GET /users/me` - Get current user

### Papers
- `GET /papers` - Get all papers
- `GET /papers/:id` - Get paper by ID
- `POST /papers` - Create paper
- `PATCH /papers/:id` - Update paper
- `DELETE /papers/:id` - Delete paper
- `PATCH /papers/favorite/:id` - Toggle favorite

### Topics
- `GET /topics` - Get all topics
- `POST /topics` - Create topic
- `PATCH /topics/:id` - Update topic
- `DELETE /topics/:id` - Delete topic

### Notes
- `GET /notes/:paperId` - Get notes for paper
- `POST /notes` - Create note
- `DELETE /notes/:id` - Delete note

### Highlights
- `GET /highlights/:paperId` - Get highlights for paper
- `POST /highlights` - Create highlight
- `DELETE /highlights/:id` - Delete highlight

### Dashboard
- `GET /dashboard` - Get dashboard statistics

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] PDF upload functionality
- [ ] Advanced search filters
- [ ] Paper recommendations
- [ ] Collaboration features
- [ ] Citation generation (APA, MLA, Chicago)
- [ ] Data export functionality
- [ ] Analytics charts
- [ ] Tags system
- [ ] Advanced permissions/sharing

## 📚 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.13.2",
  "axios": "^1.14.0",
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.1"
}
```

## 💡 Development Tips

### Adding a New Page
1. Create component in `src/pages/`
2. Import in `src/routes/AppRoutes.jsx`
3. Add route to Routes element
4. Add navigation link to Sidebar.jsx if needed

### Adding a New API Service
1. Create service file in `src/api/services/`
2. Export functions for each endpoint
3. Use in components via useState and useEffect

### Styling Guidelines
- Use semantic class names with hyphens
- Follow BEM naming convention where possible
- Use flexbox/grid for layouts
- Keep specificity low
- Use CSS variables for colors

## 🤝 Contributing

1. Follow React best practices
2. Keep components focused and reusable
3. Add error handling and loading states
4. Test across browsers
5. Maintain code consistency

## 📄 License

MIT License

---

**Built with ❤️ using React + Vite**
