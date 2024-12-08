import { Box } from '@chakra-ui/react';
import GradientBackground from './components/GradientBackground';
import ChatBox from './components/ChatBox';

function App() {
    return (
        <Box h="100vh" position="relative">
            <GradientBackground />
            <ChatBox />
        </Box>
    );
}

export default App;
