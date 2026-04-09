# 🚀 Frontend Quick Start Guide

## Installation

```bash
cd frontend
npm install
```

## Running the Frontend

**Development Mode:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

**Production Build:**
```bash
npm run build
npm run preview
```

## 🔑 Default Flow

1. **Register** - Create a new account with avatar
   - Go to: http://localhost:5173/register
   - Upload an avatar (optional)
   - Confirm password

2. **Login** - Sign in with credentials
   - Go to: http://localhost:5173
   - Enter email and password
   - Click "Sign In"

3. **Dashboard** - View overview statistics
   - Auto-redirects after login
   - Shows total papers, topics, favorites, notes

4. **Create Topics** - Organize papers by topic
   - Navigate to: Topics (🏷️)
   - Enter topic name and click "Add Topic"

5. **Upload Papers** - Add research papers
   - Navigate to: Papers (📄)
   - Papers will display here once added via API
   - Search, filter by topic, or sort

6. **Manage Paper Details**
   - Click "View" on any paper card
   - Add notes, highlights, mark as favorite
   - View paper information

7. **View Favorites**
   - Navigate to: Favorites (⭐)
   - See all bookmarked papers

## 📊 Component Architecture

```
App.jsx
└── AppRoutes.jsx (BrowserRouter)
    ├── Login.jsx
    ├── Register.jsx
    └── Layout.jsx (for protected routes)
        ├── Sidebar.jsx
        ├── Navbar.jsx
        └── Main Content (Pages)
            ├── Dashboard.jsx
            ├── Topics.jsx
            ├── Papers.jsx
            ├── PaperDetails.jsx
            └── Favorites.jsx
```

## 🎨 CSS Organization

- **Global Styles**: `src/style.css`
- **Component Classes**: Named with `.component-name`
- **Utility Classes**: `.btn`, `.alert`, `.loading`, etc.
- **States**: `.active`, `.disabled`, etc.

## 🔄 State Flow

**Authentication State:**
- Token stored in localStorage
- User object stored in localStorage
- Retrieved from localStorage on page load

**Page State:**
- Each page manages its own loading, error, and data states
- API calls trigger loading state changes
- Error messages displayed in alert boxes

## 🌐 API Configuration

**Base URL**: `http://localhost:8000/api/v1`

**Auth Headers**:
```javascript
Authorization: `Bearer ${token}`
```

**Content Types**:
- JSON for most requests
- FormData for file uploads (avatar, PDF)

## 🎯 Key Pages & Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Login | User authentication |
| `/register` | Register | User registration |
| `/dashboard` | Dashboard | Overview stats |
| `/topics` | Topics | Manage topics |
| `/papers` | Papers | Browse papers |
| `/papers/:id` | PaperDetails | Paper info, notes, highlights |
| `/favorites` | Favorites | Bookmarked papers |

## 🐛 Debugging Tips

1. **Check Console**: Open browser dev tools (F12)
2. **Network Tab**: Verify API calls are successful
3. **Redux DevTools**: (Optional, for state management)
4. **React DevTools**: Browser extension for component inspection

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above (full sidebar)
- **Tablet**: 768px - 1024px (reduced sidebar)
- **Mobile**: Below 768px (optimized layout)

## ✅ File Checklist

Essential files created/updated:

- ✅ `src/style.css` - Comprehensive styling
- ✅ `src/components/Layout.jsx` - Layout wrapper
- ✅ `src/components/Navbar.jsx` - Navigation bar
- ✅ `src/components/Sidebar.jsx` - Side navigation
- ✅ `src/components/PaperCard.jsx` - Paper card
- ✅ `src/components/TopicCard.jsx` - Topic card
- ✅ `src/components/DashboardCard.jsx` - Stats card
- ✅ `src/pages/Login.jsx` - Login page
- ✅ `src/pages/Register.jsx` - Registration page
- ✅ `src/pages/Dashboard.jsx` - Dashboard page
- ✅ `src/pages/Topics.jsx` - Topics page
- ✅ `src/pages/Papers.jsx` - Papers page
- ✅ `src/pages/PaperDetails.jsx` - Details page
- ✅ `src/pages/Favorites.jsx` - Favorites page
- ✅ `src/routes/AppRoutes.jsx` - Routing config
- ✅ `src/main.jsx` - Entry point
- ✅ API services updated

## 🚨 Common Issues & Solutions

**Issue**: "Cannot find module" error
- **Solution**: Check file paths are correct relative to importing file

**Issue**: API calls failing 401
- **Solution**: Ensure backend is running and token is valid

**Issue**: Styles not applying
- **Solution**: Ensure style.css is imported in main.jsx

**Issue**: Images not loading
- **Solution**: Use complete URLs or ensure files exist

## 📖 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Axios Documentation](https://axios-http.com)
- [React Router Documentation](https://reactrouter.com)

---

**Need Help?** Check the main [README.md](./README.md) for detailed information.
