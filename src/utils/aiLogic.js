import { searchAndCompare } from './searchLogic';

const aiMemory = {
    userInfo: {},
    conversations: []
};

const basicResponses = {
    greetings: ['Bonjour', 'Salut', 'Hey'],
    name: "Je suis United AI, ravi de vous rencontrer.",
    unknown: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler?"
};

async function processMessage(message) {
    message = message.toLowerCase();

    // Store conversation
    aiMemory.conversations.push({ user: message });

    // Basic pattern matching
    if (message.includes('bonjour') || message.includes('salut')) {
        return basicResponses.greetings[Math.floor(Math.random() * basicResponses.greetings.length)];
    }

    if (message.includes('qui es-tu') || message.includes('ton nom')) {
        return basicResponses.name;
    }

    if (message.includes('je m\'appelle') || message.includes('je suis')) {
        const name = message.split('appelle')[1] || message.split('suis')[1];
        aiMemory.userInfo.name = name.trim();
        return `Enchanté ${name.trim()}, comment puis-je vous aider ?`;
    }

    // If no basic command matches, perform web search
    try {
        const response = await searchAndCompare(message);
        return response;
    } catch (error) {
        return basicResponses.unknown;
    }
}

export { processMessage };
