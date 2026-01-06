# Collectible Card Game API Server

This is an Express.js API server for a fictional collectible card game, handling authentication, CRUD operations for cards, and token-based authorization.

## Features

- **Authentication**: JWT-based login via `/getToken`
- **Card Management**: CRUD operations for cards with JWT protection
- **Filtering**: Retrieve cards with optional query parameters
- **Additional Endpoints**: Get sets, types, rarities, card count, and random card

## Setup Instructions

1. **Install Dependencies**:
   ```
   npm install
   ```

2. **Environment Variables**:
   - Create a `.env` file in the root directory:
     ```
     SECRET_KEY=your_super_secret_jwt_key_here_change_this_in_production
     PORT=3000
     ```

3. **Data Files**:
   - `users.json`: Contains user credentials
   - `cards.json`: Will be created automatically for card data

4. **Run the Server**:
   ```
   node server.js
   ```
   Server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /getToken` - Get JWT token
  - Body: `{ "username": "john.doe", "password": "password123" }`

### Card Management
- `GET /cards` - Retrieve all cards (optional filters: `?set=...&type=...&rarity=...`)
- `POST /cards/create` - Create new card (requires JWT)
- `PUT /cards/:id` - Update card (requires JWT)
- `DELETE /cards/:id` - Delete card (requires JWT)

### Additional Features
- `GET /sets` - List all card sets
- `GET /types` - List all card types
- `GET /rarities` - List all card rarities
- `GET /cards/count` - Get total card count
- `GET /cards/random` - Get random card

## Testing

Use tools like Postman or curl to test endpoints. For protected routes, include `Authorization: Bearer <token>` header.

## Error Handling

- 401: Unauthorized (invalid/missing token)
- 400: Bad Request (invalid data)
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT tokens expire in 1 hour
- Secret key stored in `.env` (not committed to Git)
- Passwords stored in plain text (for demo; use hashing in production)