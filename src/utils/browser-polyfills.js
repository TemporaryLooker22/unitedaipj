import axios from 'axios';

// Simple browser-compatible search function
export async function browserSearch(query) {
    try {
        // Using a CORS proxy service
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        const response = await axios.get(corsProxy + searchUrl);
        return response.data;
    } catch (error) {
        console.error('Search error:', error);
        return null;
    }
}
