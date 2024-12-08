require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Search endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;

        // Validate API configuration
        if (!process.env.GOOGLE_API_KEY || !process.env.SEARCH_ENGINE_ID) {
            throw new Error('API configuration missing');
        }

        // Google Custom Search API request
        const response = await axios.get(
            `https://www.googleapis.com/customsearch/v1`, {
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    cx: process.env.SEARCH_ENGINE_ID,
                    q: query,
                    num: 5
                }
            }
        );

        // Process and format results
        const results = response.data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link
        }));

        res.json({ success: true, results });

    } catch (error) {
        console.error('Search API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Une erreur est survenue lors de la recherche'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        apiConfigured: {
            hasApiKey: !!process.env.GOOGLE_API_KEY,
            hasSearchEngineId: !!process.env.SEARCH_ENGINE_ID
        }
    });
});

// Export for Vercel
module.exports = app;
