# Upload Directory Fix

## Changes Made

### 1. Created Upload Directory
- Created `server/uploads/` directory
- Added `.gitkeep` file to track the directory in git

### 2. Updated Multer Configuration (`server/src/config/multer.ts`)
- Added automatic directory creation using `fs.mkdirSync()`
- Ensures upload directory exists before file uploads
- Prevents ENOENT errors

### 3. Updated Server Configuration (`server/index.ts`)
- Added static file serving for uploads: `app.use('/uploads', express.static('uploads'))`
- Avatars are now accessible at `http://localhost:3000/uploads/filename.png`

### 4. Updated Auth Controller (`server/src/modules/auth/auth.controller.ts`)
- Modified register function to handle file uploads from multer
- Avatar path is saved as `/uploads/filename.png`
- Falls back to 'default-avatar-url' if no file uploaded
- Supports both `fullname` and `name` fields for compatibility

### 5. Updated Client Auth Hook (`client/src/hooks/use-auth.ts`)
- Fixed response handling to match backend format
- Maps `fullname` to `name` for frontend use
- Properly extracts user data from nested response structure

### 6. Updated Home Page (`client/src/pages/home.tsx`)
- Avatar URLs now include full server path: `http://localhost:3000${user.avatar}`
- Checks for default avatar before displaying

### 7. Updated .gitignore
- Added `uploads/*` to ignore uploaded files
- Added `!uploads/.gitkeep` to track the directory structure

## How It Works

1. User uploads avatar during registration
2. Multer saves file to `server/uploads/` directory
3. Backend returns avatar path as `/uploads/filename.png`
4. Frontend displays avatar using full URL: `http://localhost:3000/uploads/filename.png`

## Testing

1. Start the backend server
2. Register a new user with an avatar
3. Avatar should be saved to `server/uploads/`
4. Avatar should display on the home page after login

## File Upload Limits

- Maximum file size: 5MB
- Allowed formats: All image types (checked on frontend)
- Filename format: `avatar-{timestamp}-{random}.{ext}`
