const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;


app.use(express.json());

// Load users from JSON file
const loadUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        const parsed = JSON.parse(data);
        return parsed.users || [];
    } catch (error) {
        console.error('Error reading users.json:', error);
        return [];
    }
};

// Load cards from JSON file
const loadCards = () => {
    try {
        const data = fs.readFileSync('cards.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading cards.json:', error);
        return [];
    }
};

// Save cards to JSON file
const saveCards = (cards) => {
    try {
        fs.writeFileSync('cards.json', JSON.stringify(cards, null, 2));
    } catch (error) {
        console.error('Error writing cards.json:', error);
    }
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ errorMessage: 'Access token required' });
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ errorMessage: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// POST /getToken endpoint
app.post('/getToken', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY, {
        expiresIn: '1h'
    });

    res.json({ token });
});

// GET /cards endpoint with optional filtering
app.get('/cards', (req, res) => {
    const cards = loadCards();
    let filteredCards = cards;

    // Apply filters based on query parameters (equality matches)
    Object.keys(req.query).forEach(key => {
        filteredCards = filteredCards.filter(card => card[key] == req.query[key]);
    });

    res.json(filteredCards);
});

// POST /cards/create endpoint (protected)
app.post('/cards/create', authenticateToken, (req, res) => {
    const newCard = req.body;
    const cards = loadCards();

    // Check if cardId is unique
    if (cards.some(card => card.id === newCard.id)) {
        return res.status(400).json({ errorMessage: 'Card ID must be unique' });
    }

    cards.push(newCard);
    saveCards(cards);

    res.json({ successMessage: 'Card created successfully', card: newCard });
});

// PUT /cards/:id endpoint (protected)
app.put('/cards/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const updatedCard = req.body;
    const cards = loadCards();
    const cardIndex = cards.findIndex(card => card.id == id);

    if (cardIndex === -1) {
        return res.status(404).json({ errorMessage: 'Card not found' });
    }

    // Check if new id is unique (if changing id)
    if (updatedCard.id && updatedCard.id !== id && cards.some(card => card.id === updatedCard.id)) {
        return res.status(400).json({ errorMessage: 'Card ID must be unique' });
    }

    cards[cardIndex] = { ...cards[cardIndex], ...updatedCard };
    saveCards(cards);

    res.json({ successMessage: 'Card updated successfully', card: cards[cardIndex] });
});

// DELETE /cards/:id endpoint (protected)
app.delete('/cards/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const cards = loadCards();
    const cardIndex = cards.findIndex(card => card.id == id);

    if (cardIndex === -1) {
        return res.status(404).json({ errorMessage: 'Card not found' });
    }

    const deletedCard = cards.splice(cardIndex, 1)[0];
    saveCards(cards);

    res.json({ successMessage: 'Card deleted successfully', card: deletedCard });
});

// GET /sets - Retrieve a list of all card sets available
app.get('/sets', (req, res) => {
    const cards = loadCards();
    const sets = [...new Set(cards.map(card => card.set).filter(set => set))];
    res.json(sets);
});

// GET /types - Retrieve a list of all card types available
app.get('/types', (req, res) => {
    const cards = loadCards();
    const types = [...new Set(cards.map(card => card.type).filter(type => type))];
    res.json(types);
});

// GET /rarities - Retrieve a list of all card rarities available
app.get('/rarities', (req, res) => {
    const cards = loadCards();
    const rarities = [...new Set(cards.map(card => card.rarity).filter(rarity => rarity))];
    res.json(rarities);
});

// GET /cards/count - Retrieve the total number of cards
app.get('/cards/count', (req, res) => {
    const cards = loadCards();
    res.json({ count: cards.length });
});

// GET /cards/random - Retrieve information about a randomly selected card
app.get('/cards/random', (req, res) => {
    const cards = loadCards();
    if (cards.length === 0) {
        return res.status(404).json({ errorMessage: 'No cards available' });
    }
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    res.json(randomCard);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ errorMessage: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});