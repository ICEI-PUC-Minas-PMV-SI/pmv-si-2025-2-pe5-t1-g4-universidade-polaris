# Student Management API - Backend

Backend API for the Universidade Polaris student management system built with Express.js, Node.js, and MariaDB.

## Architecture

Express.js API with clean architecture pattern:

```
src/
├── server.js             # Application entry point
├── config/               # Configuration management
├── middleware/           # Authentication, validation, error handling
├── routes/               # API route definitions
├── controllers/          # Request handlers
├── services/             # Business logic
├── repositories/         # Database access layer
├── models/               # Database models (Sequelize ORM)
└── utils/                # Helper functions
```

### Key Features

- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control (RBAC) with hierarchy (Admin > Moderator > Teacher > Student)
- **Database**: Sequelize ORM with MariaDB
- **Validation**: Express-validator for input validation
- **Security**: Password hashing with bcryptjs, CORS enabled

## Prerequisites

- **Node.js** v16 or higher
- **npm** or yarn
- **MariaDB** v10.5+ or **MySQL** v5.7+

## Local Setup

### 1. Install Dependencies

```bash
cd web-app/backend
npm install
```

### 2. Database Setup

#### Start MariaDB Service

**On Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mariadb
```

**On Windows:**
```bash
# If using MySQL/MariaDB installer, start the service through Services panel
# Or via command line:
net start MySQL80  # Adjust version number as needed
```

#### Create Database and User

```bash
# Access MariaDB CLI
mysql -u root -p

# Enter your root password when prompted
# Then execute the following SQL commands:
```

```sql
-- Create database
CREATE DATABASE student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create app user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON student_management.* TO 'app_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL CLI
EXIT;
```

#### Initialize Database Schema

```bash
# From the backend directory, import the schema
mysql -u app_user -p student_management < database-schema.sql

# Enter the password you set above when prompted
```

### 3. Environment Configuration

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Minimal .env configuration:**

```dotenv
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=your_secure_password_here
DB_NAME=student_management

# JWT Configuration (generate a secure random string)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it into your `JWT_SECRET` in `.env`

### 4. Seed Initial Admin User (Optional)

After database setup, you can create an initial admin user:

```bash
npm run seed  # If seed script is available
```

Or manually create via MariaDB:

```bash
mysql -u app_user -p student_management

-- Insert admin user (password is hashed)
INSERT INTO users (name, email, password, role) VALUES 
('Administrator', 'admin@university.edu', '$2a$10/hashed_password_here', 'admin');
```

### 5. Start Development Server

```bash
# Start with nodemon (watches for file changes)
npm run dev

# Or start production mode
npm start
```

Server will be available at: `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update own profile

### User Management (Protected)

- `POST /api/users` - Create new user (Admin, Moderator, Teacher)
- `GET /api/users` - List users (with role-based filtering)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## Role Hierarchy

The system implements a role hierarchy for permission management:

```
Admin (Level 0)
  ├─ Can create: Moderator, Teacher, Student
  ├─ Can view: All users
  └─ Can edit/delete: All users below their level

Moderator (Level 1)
  ├─ Can create: Teacher, Student
  ├─ Can view: Moderator, Teacher, Student (NOT Admin)
  └─ Can edit: Teacher, Student only

Teacher (Level 2)
  ├─ Can create: Student
  ├─ Can view: Teacher, Student (NOT Admin/Moderator)
  └─ Can edit: Student only

Student (Level 3)
  ├─ Can create: None
  ├─ Can view: Own profile only
  └─ Can edit: Own profile only
```

## Database Schema

The `database-schema.sql` file includes two main tables:

### Users Table
- `id` - Primary key
- `name` - User full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin, moderator, teacher, student)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## Testing API Endpoints

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"password123"}'

# Get users (requires token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```


## Troubleshooting

**Issue: Cannot connect to database**
- Verify MariaDB is running: `mysql -u root -p`
- Check credentials in `.env` match database user
- Ensure database and user were created successfully

**Issue: JWT_SECRET error**
- Generate new secret using command in Environment Configuration step
- Update `.env` with new secret

## Development Guidelines

1. Never commit `.env` file (use `.env.example`)
2. Always validate user input using express-validator
3. Always hash passwords before saving (bcryptjs)
4. Use proper HTTP status codes (200, 201, 400, 403, 404, 500)
5. Include error messages in JSON responses
6. Test all role-based routes with different user roles

## Security Notes

- Change JWT_SECRET before production deployment
- Use strong database passwords
- Enable HTTPS in production
- Keep Node.js and dependencies updated
- Use environment variables for sensitive data
- Implement rate limiting for login endpoint
- Add CORS configuration for frontend domain

## Next Steps

After local setup works:
1. Test all API endpoints with different user roles
2. Verify database data integrity
3. Review and customize business logic as needed
4. Prepare for EC2 deployment (see COMPLETE_SETUP_GUIDE.md)
