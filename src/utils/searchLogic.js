import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:5000/api';

async function searchAndCompare(query) {
    try {
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
        let errorMessage = "Désolé, une erreur s'est produite: ";

        if (error.response) {
            errorMessage += `(${error.response.status})`;
        } else if (error.request) {
            errorMessage += "Impossible de contacter le serveur";
        } else {
            errorMessage += error.message;
        }

        console.error('Search error:', error);
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
