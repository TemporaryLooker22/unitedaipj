require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'https://unitedaigo.vercel.app',
        'https://unitedaigo-5sdad1hdp-arthurvanstrydonckmail-gmailcoms-projects.vercel.app',
        'http://localhost:3000'
    ],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

// Search endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;

        // Validate API configuration
        if (!process.env.GOOGLE_API_KEY || !process.env.SEARCH_ENGINE_ID) {
            throw new Error('API configuration missing');
        }

        console.log('Received search query:', query);
        console.log('API Key configured:', !!process.env.GOOGLE_API_KEY);
        console.log('Search Engine ID configured:', !!process.env.SEARCH_ENGINE_ID);

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

        console.log('Search successful, found', results.length, 'results');
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

const PORT = process.env.PORT || 5000;

// Start server if not in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API Key configured: ${process.env.GOOGLE_API_KEY ? 'Yes' : 'No'}`);
        console.log(`Search Engine ID configured: ${process.env.SEARCH_ENGINE_ID ? 'Yes' : 'No'}`);
    });
}

// Export for production
module.exports = app;
