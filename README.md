# Collectible Card Game API

A simple Express.js API for managing collectible cards with authentication.

## Setup

1. Install dependencies: `npm install`
2. Run the server: `node server.js`
3. Open `http://localhost:3000` in your browser for the web interface.

## API Endpoints

### Auth
- `POST /getToken` - Login with username/password

### Cards
- `GET /cards` - Get all cards (optional filters: `?set=...&type=...&rarity=...`)
- `POST /cards/create` - Create card (requires token)
- `PUT /cards/:id` - Update card (requires token)
- `DELETE /cards/:id` - Delete card (requires token)

### Extras
- `GET /sets` - List card sets
- `GET /types` - List card types
- `GET /rarities` - List card rarities
- `GET /cards/count` - Card count
- `GET /cards/random` - Random card

## Testing

Use the web interface or tools like Postman. Include `Authorization: Bearer <token>` for protected routes.

## Errors

- 401: Unauthorized
- 400: Bad request
- 404: Not found
- 500: Server error