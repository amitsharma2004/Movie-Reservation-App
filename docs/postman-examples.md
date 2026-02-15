# Postman API Testing Examples

This document provides example requests for testing the Movie Reservation API endpoints in Postman.

## Authentication Setup

### 1. Register User
**POST** `/api/auth/register`

**Body** (form-data):
```
fullname: John Doe
email: john.doe@example.com
password: password123
avatar: [Select file]
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isVerified": false,
      "avatar": "/uploads/avatar-xxx.png"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Body** (JSON):
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "avatar": "/uploads/avatar-xxx.png"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Important**: Copy the `accessToken` from the response. You'll need it for authenticated requests.

---

## Setting Up Authorization in Postman

### Method 1: Using Authorization Tab
1. In Postman, go to the request
2. Click on "Authorization" tab
3. Select "Bearer Token" from Type dropdown
4. Paste your access token in the Token field

### Method 2: Using Headers
1. Go to "Headers" tab
2. Add new header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGc...` (your access token)

### Method 3: Using Environment Variables (Recommended)
1. Create a new environment in Postman
2. Add variable: `accessToken`
3. After login, manually copy token to this variable
4. In Authorization tab, use: `Bearer {{accessToken}}`

---

## Profile Endpoints

### 1. Get Profile
**GET** `/api/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGc...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "65abc123def456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isVerified": false,
    "avatar": "/uploads/avatar-1234567890.png",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }
}
```

### 2. Update Profile
**PUT** `/api/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "fullname": "John Michael Doe",
  "phone": "+1234567890",
  "address": "456 Oak Avenue, Apt 3B",
  "city": "Los Angeles",
  "state": "California",
  "zipCode": "90001",
  "country": "United States"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "65abc123def456789",
    "name": "John Michael Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isVerified": false,
    "avatar": "/uploads/avatar-1234567890.png",
    "phone": "+1234567890",
    "address": "456 Oak Avenue, Apt 3B",
    "city": "Los Angeles",
    "state": "California",
    "zipCode": "90001",
    "country": "United States",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-21T09:15:00.000Z"
  }
}
```

---

## Dummy Data Examples

### Minimal Update (Only Name)
```json
{
  "fullname": "Jane Smith"
}
```

### Partial Update (Name and Phone)
```json
{
  "fullname": "Robert Johnson",
  "phone": "+19876543210"
}
```

### Complete Profile Update
```json
{
  "fullname": "Emily Davis",
  "phone": "+14155551234",
  "address": "789 Pine Street, Suite 200",
  "city": "San Francisco",
  "state": "California",
  "zipCode": "94102",
  "country": "United States"
}
```

### International Address
```json
{
  "fullname": "Raj Kumar",
  "phone": "+919876543210",
  "address": "42 MG Road, Koramangala",
  "city": "Bangalore",
  "state": "Karnataka",
  "zipCode": "560034",
  "country": "India"
}
```

### UK Address
```json
{
  "fullname": "Oliver Thompson",
  "phone": "+447700900123",
  "address": "10 Downing Street",
  "city": "London",
  "state": "England",
  "zipCode": "SW1A 2AA",
  "country": "United Kingdom"
}
```

---

## Movies Endpoints

### 1. Get All Movies
**GET** `/api/movies`

**Response**:
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "_id": "...",
        "title": "Inception",
        "description": "A thief who steals corporate secrets...",
        "genre": ["Action", "Sci-Fi", "Thriller"],
        "duration": 148,
        "releaseDate": "2010-07-16",
        "rating": 8.8,
        "poster": "https://...",
        "trailer": "https://..."
      }
    ]
  }
}
```

### 2. Search Movies
**GET** `/api/movies/search?q=inception`

### 3. Get Movie by ID
**GET** `/api/movies/:id`

### 4. Get Upcoming Movies
**GET** `/api/movies/upcoming`

### 5. Get Now Showing
**GET** `/api/movies/now-showing`

### 6. Get Nearby Movies
**GET** `/api/movies/nearby?lat=40.7128&lng=-74.0060`

---

## Theater Endpoints (Admin Only)

### 1. Create Theater
**POST** `/api/theaters/create`

**Headers**:
```
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

**Body**:
```json
{
  "name": "AMC Empire 25",
  "address": "234 W 42nd St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10036",
  "phone": "+12125551234",
  "screens": 25,
  "facilities": ["IMAX", "Dolby Atmos", "3D", "Recliner Seats"]
}
```

### 2. Get All Theaters
**GET** `/api/theaters/getall`

### 3. Get Theater by ID
**GET** `/api/theaters/get/:id`

### 4. Update Theater
**PUT** `/api/theaters/update/:id`

**Body**:
```json
{
  "name": "AMC Empire 25 - Updated",
  "screens": 26
}
```

### 5. Delete Theater
**DELETE** `/api/theaters/delete/:id`

### 6. Search Theaters
**GET** `/api/theaters/search?q=amc`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be between 10 and 15 digits"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Testing Workflow

### 1. Initial Setup
1. Register a new user
2. Copy the access token
3. Set up authorization in Postman

### 2. Test Profile
1. Get profile (should return user data)
2. Update profile with dummy data
3. Get profile again (verify changes)

### 3. Test Movies
1. Get all movies
2. Search for a movie
3. Get movie details
4. Test filters (upcoming, now showing)

### 4. Test Admin Features (if admin)
1. Create a theater
2. Get all theaters
3. Update theater
4. Search theaters
5. Delete theater

---

## Postman Collection Import

You can create a Postman collection with these endpoints:

1. Click "Import" in Postman
2. Create a new collection: "Movie Reservation API"
3. Add folders:
   - Authentication
   - Profile
   - Movies
   - Theaters
4. Add requests from examples above
5. Set up environment variables:
   - `baseUrl`: `http://localhost:3000/api` (dev) or `https://your-api.onrender.com/api` (prod)
   - `accessToken`: (set after login)

---

## Tips for Testing

1. **Use Environment Variables**: Set `{{baseUrl}}` and `{{accessToken}}` for easy switching between dev/prod
2. **Save Responses**: Use Postman's "Save Response" feature to compare changes
3. **Test Error Cases**: Try invalid data to test validation
4. **Check Response Times**: Monitor API performance
5. **Use Pre-request Scripts**: Auto-refresh tokens if needed
6. **Collection Runner**: Run all tests in sequence

---

## Validation Rules

### Profile Update
- `fullname`: 2-50 characters
- `phone`: 10-15 digits (optional)
- `address`: max 200 characters (optional)
- `city`: max 50 characters (optional)
- `state`: max 50 characters (optional)
- `zipCode`: max 20 characters (optional)
- `country`: max 50 characters (optional)

### Theater Creation
- `name`: required, 2-100 characters
- `address`: required
- `city`: required
- `state`: required
- `zipCode`: required
- `phone`: required, 10-15 digits
- `screens`: required, positive number
- `facilities`: array of strings (optional)

---

## Quick Test Script

Here's a quick test sequence:

```bash
# 1. Register
POST /api/auth/register
# Copy accessToken

# 2. Get Profile
GET /api/auth/profile
# Headers: Authorization: Bearer {token}

# 3. Update Profile
PUT /api/auth/profile
# Headers: Authorization: Bearer {token}
# Body: { "fullname": "New Name", "city": "New City" }

# 4. Verify Update
GET /api/auth/profile
# Headers: Authorization: Bearer {token}
# Should show updated data
```

---

## Need Help?

- Check API documentation in `docs/api.md`
- Review backend validation in `server/src/modules/auth/auth.validate.ts`
- Check controller logic in `server/src/modules/auth/auth.controller.ts`
