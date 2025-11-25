# Universidade Polaris - Frontend Setup Guide

React application for user and student management with role-based access control (RBAC). This guide covers **local development setup only**. For EC2 deployment instructions, see `COMPLETE_SETUP_GUIDE.md` in the project root.

## System Requirements

- **Node.js**: v16 or higher
- **npm**: v7 or higher (or yarn v3+)
- **Operating System**: macOS, Linux, or Windows (with WSL2 recommended)
- **Port**: 5173 (dev server) - ensure it's available

## Local Development Setup

### 1. Install Node.js and npm

**Linux (Debian/Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

**Windows:**
- Download from https://nodejs.org/en/download/
- Install LTS version (currently v18+)
- Open new terminal and verify: `node --version` and `npm --version`

### 2. Clone and Navigate to Frontend Directory

```bash
cd web-app/frontend
```

Verify directory structure:
```bash
ls -la
# Should show: package.json, vite.config.js, src/, etc.
```

### 3. Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- React 18.2.0
- React Router 6.15.0
- Axios (HTTP client)
- Vite 4.4.0 (build tool)

### 4. Configure Environment Variables

Create `.env.local` file in the `frontend` directory:

```bash
# .env.local (for local development)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Universidade Polaris
```

**Note:** The backend must be running on `http://localhost:5000` (see backend README)

### 5. Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v4.4.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open browser: http://localhost:5173/

### 6. Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory ready for deployment.

## Features

### Role-Based Access Control (RBAC)

Four-level role hierarchy implemented across all modules:

1. **Admin** (Level 0)
   - Full access to all users
   - Can create/edit/delete all roles (admin, moderator, teacher, student)
   - Access to user management dashboard
   - No role restrictions

2. **Moderator** (Level 1)
   - Can manage moderators and lower roles (teacher, student)
   - Cannot manage or see admins
   - Full access to user management

3. **Teacher** (Level 2)
   - Can create and edit students only
   - Cannot manage other users
   - Access to "Ver Estudantes" (View Students) page
   - Button: "Novo Estudante" (New Student)

4. **Student** (Level 3)
   - Limited to own profile editing
   - Cannot access user management
   - Can only view/edit personal information

### Core Features

**Authentication:**
- Login page with email/password
- Signup page for new user registration
- JWT token-based session management
- Automatic token injection in API requests
- Protected routes (redirect to login if not authenticated)

**User Management (Admin/Moderator):**
- View all users with role filtering
- Create new users with role assignment
- Edit user details
- Delete users
- Role hierarchy enforcement

**Student Management (Teachers):**
- View list of students
- Create new students
- Edit student details
- See student information in table format

**Profile Management (All Users):**
- Edit personal profile
- Change password (6+ characters required)
- Update email and name
- Changes persist immediately

## Project Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── AlertMessage.jsx
│   │   └── ...
│   ├── pages/              # Page components (routes)
│   │   ├── login-page.jsx
│   │   ├── signup-page.jsx
│   │   ├── dashboard-page.jsx
│   │   ├── profile-page.jsx
│   │   ├── user-management-page.jsx
│   │   ├── user-form-page.jsx
│   │   └── ...
│   ├── services/           # API communication layer
│   │   ├── auth-service.js
│   │   ├── api-client.js
│   │   └── ...
│   ├── context/            # Global state (Auth)
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── styles/             # CSS files
│   │   ├── global.css
│   │   ├── components/
│   │   └── pages/
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── router.jsx          # Route definitions
├── public/                 # Static assets
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| React Router | 6.15.0 | Client-side routing |
| Axios | 1.4.0+ | HTTP client with interceptors |
| Vite | 4.4.0 | Build tool & dev server |
| CSS | Native | Styling |

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production (creates dist/ folder)
npm run build

# Preview production build
npm run preview

# List dependencies
npm list
```

## Form Validation Rules

All forms enforce client-side and server-side validation:

- **Name**: Minimum 2 characters
- **Email**: Valid email format (RFC 5322)
- **Password**: Minimum 6 characters
- **Role**: Must be valid role in hierarchy

## Environment Configuration

### Development (.env.local)
```env
# Backend API endpoint
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Universidade Polaris
```

### Production
Set these environment variables in your hosting platform:
- `VITE_API_URL` - Your production backend API URL
- `VITE_APP_NAME` - Application name

**Important:** Backend must be accessible at the `VITE_API_URL` endpoint.

## API Communication

### Authentication Flow

1. User enters credentials on login page
2. Frontend sends `POST /auth/login` to backend
3. Backend returns JWT token
4. Token stored in localStorage as `authToken`
5. Axios interceptor automatically adds token to all requests
6. Token includes user info: `{id, email, role, name}`

### Error Handling

- Network errors: Display alert message
- 401 Unauthorized: Redirect to login
- 403 Forbidden: Display permission error
- 4xx/5xx: Display server error message

### API Interceptors

Axios automatically:
- Adds `Authorization: Bearer <token>` header to all requests
- Handles 401 responses by redirecting to login
- Refreshes localStorage on successful profile updates

## Common Issues & Troubleshooting

### Issue: "Cannot connect to backend" errors
- Verify backend is running
- Check `VITE_API_URL` in `.env.local`
- Ensure `.env.local` is in `frontend/` directory (not root)
- Restart dev server: `npm run dev`

### Issue: CORS errors
- Backend must have CORS enabled for the frontend running port 
- Check backend CORS configuration in `web-app/backend/src/server.js`

### Issue: Login page shows but cannot submit
- Verify backend is responding: `curl http://localhost:5000/api/auth/login -X POST`
- Check browser console (F12) for network errors
- Verify email/password format (email must be valid format)

### Issue: "Token is undefined" errors
- Clear localStorage: Open DevTools (F12) → Application → Local Storage → Delete all
- Logout and login again
- Check that backend returns `token` in login response

### Issue: Changes not appearing after save
- This should be fixed automatically (localStorage updates on save)
- If still occurring: Refresh page manually (Ctrl+R)
- Check browser console for API errors

## Development Workflow

### Creating New Pages

1. Create component in `src/pages/`
2. Add route to `src/router.jsx`
3. Import components as needed
4. Use `useAuth()` hook for authentication
5. Use `useNavigate()` for routing

### Creating New API Calls

1. Add method to appropriate service in `src/services/`
2. Use `api_client` for HTTP requests
3. Handle errors with try/catch
4. Return data or throw error

### Styling Components

1. Create CSS file in `src/styles/pages/` or `src/styles/components/`
2. Import CSS in component
3. Use CSS class names
4. Follow existing naming conventions

## Testing in Development

### Test with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@polaris.edu","password":"123456"}'

# Response should include token:
# {"token":"eyJhbGc...","user":{"id":1,"email":"admin@polaris.edu","role":"admin"}}
```

### Test in Browser

1. Open http://localhost:<port>/login
2. Use credentials
3. Open DevTools (F12) → Application → Local Storage
4. Verify `user` and `authToken` are stored
5. Navigate to different pages to test routing

## Next Steps

1. (IF not started) Backend setup - See `web-app/backend/README.md`

## Related Documentation

- Backend Setup AND API Documentation: See `web-app/backend/README.md`
