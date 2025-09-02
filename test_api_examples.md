# User Authentication API Examples

## Base URL
```
http://localhost:8080/api
```

## 1. User Signup
**POST** `/api/users/signup`

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "User registered successfully!",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "password": "$2a$10$..."
    }
}
```

## 2. User Login
**POST** `/api/users/login`

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful!",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "password": "$2a$10$..."
    }
}
```

## 3. Get All Users
**GET** `/api/users`

**Response:**
```json
[
    {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "password": "$2a$10$..."
    },
    {
        "id": 2,
        "username": "user",
        "email": "user@example.com",
        "password": "$2a$10$..."
    }
]
```

## 4. Get User by Username
**GET** `/api/users/username/{username}`

**Response:**
```json
{
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "password": "$2a$10$..."
}
```

## 5. Update User
**PUT** `/api/users/username/{username}`

**Request Body:**
```json
{
    "username": "john_updated",
    "email": "john.updated@example.com",
    "password": "newpassword123"
}
```

## 6. Delete User
**DELETE** `/api/users/username/{username}`

**Response:**
```json
{
    "message": "User deleted successfully!"
}
```

## Default Users (Created on Startup)
- **Admin User**: `admin` / `admin123`
- **Regular User**: `user` / `user123`

## Testing with cURL

### Signup:
```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass"}'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### Get All Users:
```bash
curl -X GET http://localhost:8080/api/users
```

## Testing with Postman
1. Import the collection
2. Set the base URL to `http://localhost:8080`
3. Test each endpoint with the examples above

## Notes
- Passwords are automatically hashed using BCrypt
- Usernames and emails must be unique
- All endpoints support CORS for cross-origin requests
- No JWT tokens - simple sessionless authentication
