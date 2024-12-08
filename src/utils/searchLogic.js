import axios from 'axios';

// API URL configuration with absolute paths
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://unitedaigo.vercel.app/api'  // Production URL
    : 'http://localhost:5000/api';

async function searchAndCompare(query) {
    try {
        // Debug logs
        console.log('Environment:', process.env.NODE_ENV);
        console.log('API URL:', API_URL);
        console.log('Making request to:', `${API_URL}/search`);

        const response = await axios.post(`${API_URL}/search`, {
            query: query
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.success) {
            console.error('Search failed:', response.data);
            return `Désolé, la recherche a échoué: ${response.data.error || 'Raison inconnue'}`;
        }

        return formatResponse(response.data.results);

    } catch (error) {
        // Detailed error handling
        let errorMessage = "Désolé, une erreur s'est produite: ";

        if (error.response) {
            // Server responded with error
            errorMessage += `(${error.response.status}) ${error.response.data?.error || ''}`;
            console.error('Server error:', error.response.data);
        } else if (error.request) {
            // No response received
            errorMessage += "Impossible de contacter le serveur. Vérifiez votre connexion.";
            console.error('Network error:', error.request);
        } else {
            // Request setup error
            errorMessage += error.message;
            console.error('Request setup error:', error.message);
        }

        return errorMessage;
    }
}

function formatResponse(results) {
    if (!results || results.length === 0) {
        return "Aucun résultat trouvé.";
    }

    const formattedResults = results.map(result =>
        `${result.title}\n${result.snippet}`
    ).join('\n\n');

    return `D'après mes recherches:\n\n${formattedResults}`;
}

export { searchAndCompare };
