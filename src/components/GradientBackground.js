import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const animatedGradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

function GradientBackground() {
    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(to-r, purple.500, pink.500, blue.500)"
            backgroundSize="200% 200%"
            animation={`${animatedGradient} 15s ease infinite`}
            zIndex="0"
        />
    );
}

export default GradientBackground;
