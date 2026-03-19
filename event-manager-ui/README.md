# Event Manager UI - React Frontend

A modern, responsive React single-page application for managing college events. This is the frontend for the College Event Management System built with React 18+.

## Features

### Student Features
- **User Registration & Login**: Secure authentication with JWT tokens
- **Browse Events**: Search and filter college events by category, date range, and organizer
- **Event Details**: View complete event information with capacity tracking
- **Event Registration**: Register for events with one-click registration
- **My Registrations**: Manage registered events and view registration history
- **Profile Management**: Update personal information, change password, view account activity

### Admin Features
- **Admin Dashboard**: View system statistics and quick actions
- **Create Events**: Create new events with detailed information and category classification
- **Manage Events**: Edit, approve, reject, and delete events
- **Manage Users**: View all users, search, and manage user accounts (enable/disable)
- **View Registrations**: Manage event registrations, mark attendance, and remove students

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.0+ |
| **Language** | JavaScript/JSX |
| **Routing** | React Router 6.0+ |
| **HTTP Client** | Axios 1.4+ |
| **State Management** | React Context API & Hooks |
| **Form Validation** | React Hook Form |
| **Styling** | CSS3 with CSS Variables |
| **Build Tool** | Create React App / Vite |

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── Loading.jsx
│   │   ├── Badge.jsx
│   │   ├── FormInput.jsx
│   │   └── Pagination.jsx
│   ├── auth/             # Authentication components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── student/          # Student feature components
│   │   ├── Dashboard.jsx
│   │   ├── BrowseEvents.jsx
│   │   ├── EventDetails.jsx
│   │   ├── MyRegistrations.jsx
│   │   └── Profile.jsx
│   └── admin/            # Admin feature components
│       ├── AdminDashboard.jsx
│       ├── CreateEvent.jsx
│       ├── ManageEvents.jsx
│       ├── ManageUsers.jsx
│       └── ViewRegistrations.jsx
├── context/              # React Context providers
│   ├── AuthContext.js
│   └── NotificationContext.js
├── hooks/                # Custom React hooks
│   ├── useAuth.js
│   ├── useNotification.js
│   ├── useFetch.js
│   └── useDebounce.js
├── services/             # API service layer
│   ├── api.js           # Axios instance with interceptors
│   ├── authService.js
│   ├── eventService.js
│   ├── registrationService.js
│   └── userService.js
├── utils/                # Utility functions
│   ├── constants.js      # App constants and config
│   ├── validation.js     # Form validation helpers
│   ├── formatters.js     # Date/time and number formatting
│   └── localStorage.js   # Local storage helpers
├── styles/               # Global styles
│   ├── variables.css     # CSS custom properties
│   └── responsive.css    # Responsive design breakpoints
├── App.js                # Root component with routing
└── index.js              # React entry point
```

## Installation

1. **Clone the repository**
   ```bash
   cd event-manager-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set REACT_APP_API_URL to your backend API URL
   ```

## Getting Started

### Development Server
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Builds the app for production in the `build` folder

### Run Tests
```bash
npm test
```
Launches the test runner

## Key Components

### Authentication Flow
- Users register or login via the Auth components
- JWT tokens are stored in localStorage and passed via Axios interceptors
- ProtectedRoute component enforces access control
- AuthContext manages global authentication state

### State Management
- **AuthContext**: Global authentication state (user, token, login status)
- **NotificationContext**: Global notification/toast state
- **Local State**: Component-level state managed with useState hooks
- **API Calls**: Custom useFetch hook for data fetching

### API Integration
- Centralized Axios instance in `services/api.js`
- Request interceptors add JWT tokens automatically
- Response interceptors handle 401 errors and redirects
- Individual service modules for different API endpoints

### Form Handling
- FormInput, FormSelect, FormTextarea components with validation
- Validation helpers in `utils/validation.js`
- Real-time error display and feedback
- Password strength indicator during registration

## Design System

### Colors
- **Primary**: #0066CC (Blue)
- **Secondary**: #00A896 (Teal)
- **Success**: #28A745 (Green)
- **Warning**: #FF9800 (Orange)
- **Danger**: #DC3545 (Red)

### Spacing (8px Grid)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

### Typography
- Font Family: Segoe UI
- Heading 1: 32px/700, Heading 2: 24px/600, Body: 14px/400

### Responsive Breakpoints
- xs: <480px (small phones)
- sm: 480px (mobile)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1440px (desktops)
- 2xl: 1920px (large displays)

## Features & Components Checklist

### Common Components ✅
- [x] Button (with variants: primary, secondary, danger, success, warning)
- [x] Card (with header, body, footer)
- [x] Navbar (sticky navigation)
- [x] Sidebar (collapsible navigation)
- [x] Modal (with confirmation variant)
- [x] Toast Notifications (success, error, info, warning)
- [x] Loading Spinner & Skeleton Loaders
- [x] Badge & Status Badges
- [x] Form Inputs (text, email, password, textarea, select, checkbox)
- [x] Pagination

### Authentication ✅
- [x] Login Component
- [x] Register Component
- [x] Password validation with strength indicator
- [x] Protected Routes
- [x] JWT token management

### Student Components ✅
- [x] Student Dashboard
- [x] Browse Events (with search and filtering)
- [x] Event Details Page
- [x] My Registrations
- [x] User Profile Management

### Admin Components ✅
- [x] Admin Dashboard
- [x] Create Event Form
- [x] Manage Events Table
- [x] Manage Users Table
- [x] View Registrations

## API Endpoints Assumed

The frontend expects the following API endpoints to be available at `REACT_APP_API_URL`:

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`

### Events
- `GET /events`
- `GET /events/{id}`
- `POST /events`
- `PUT /events/{id}`
- `DELETE /events/{id}`
- `PUT /events/{id}/approve`
- `PUT /events/{id}/reject`

### Registrations
- `GET /registrations/my`
- `POST /registrations`
- `PUT /registrations/{id}/cancel`
- `GET /events/{eventId}/registrations`
- `PUT /registrations/{id}/mark-attended`
- `PUT /registrations/{id}/remove`

### Users
- `GET /users`
- `GET /users/profile`
- `PUT /users/profile`
- `PUT /users/{id}/status`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Code Splitting**: Routes are lazy loaded using React.lazy()
- **Debouncing**: Search input uses useDebounce hook to reduce API calls
- **Memoization**: Components are optimized with React.memo where appropriate
- **Image Optimization**: Event images are loaded with lazy loading
- **CSS Variables**: Efficient styling with CSS custom properties

## Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML structure
- Proper form labels and error associations
- Keyboard navigation support
- Color contrast ratio >= 4.5:1
- Focus indicators visible

## Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8003/api

# App Mode
REACT_APP_MODE=development
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting
The `build` folder can be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.)

## Development Guidelines

1. **Component Structure**: Keep components focused and reusable
2. **Naming Conventions**: Use PascalCase for components, camelCase for functions
3. **Props & PropTypes**: Document component props clearly
4. **Error Handling**: Always handle API errors gracefully
5. **Loading States**: Show loading indicators during async operations
6. **Mobile First**: Design for mobile, then enhance for larger screens

## Troubleshooting

### API Connection Issues
- Ensure backend is running on the configured port
- Check CORS configuration on backend
- Verify REACT_APP_API_URL in .env file

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT token expiration
- Verify authentication backend is working

### Styling Issues
- Check CSS variables are properly loaded
- Verify responsive breakpoints in use
- Clear browser cache

## Future Enhancements

- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Event export to calendar
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch

## License

This project is part of the College Event Management System

## Support

For issues, bugs, or feature requests, please refer to the main project documentation or contact the development team.


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
