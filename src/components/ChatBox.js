import { Box, Input, VStack, Text } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { processMessage } from '../utils/aiLogic';

const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function ChatBox() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newConversation = [...conversation, { type: 'user', text: message }];
        setConversation(newConversation);

        // Add loading message
        setConversation(conv => [...conv, { type: 'ai', text: 'Recherche en cours...' }]);

        // Get response
        const response = await processMessage(message);

        // Update with real response
        setConversation(conv => [...conv.slice(0, -1), { type: 'ai', text: response }]);
        setMessage('');
    };

    return (
        <VStack
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="1"
            spacing={4}
            w={["90%", "70%", "50%"]}
            maxW="600px"
            fontFamily="Poppins"
        >
            <Box
                w="100%"
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(16px)"
                borderRadius="xl"
                p={6}
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                border="1px solid rgba(255, 255, 255, 0.18)"
                maxH="400px"
                overflowY="auto"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '24px',
                    },
                }}
            >
                {conversation.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        animate="visible"
                        variants={messageVariants}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Box
                            mb={3}
                            display="flex"
                            justifyContent={msg.type === 'user' ? 'flex-end' : 'flex-start'}
                        >
                            <Text
                                color="white"
                                p={3}
                                bg="rgba(255, 255, 255, 0.15)"
                                backdropFilter="blur(20px)"
                                borderRadius="lg"
                                maxW="80%"
                                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                                fontFamily="Poppins"
                                fontSize="0.95rem"
                                letterSpacing="0.3px"
                                border="1px solid rgba(255, 255, 255, 0.18)"
                                _hover={{
                                    transform: 'translateY(-1px)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                {msg.text}
                            </Text>
                        </Box>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box
                as="form"
                onSubmit={handleSubmit}
                w="100%"
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(16px)"
                borderRadius="xl"
                p={4}
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                border="1px solid rgba(255, 255, 255, 0.18)"
                transition="all 0.3s"
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 36px 0 rgba(31, 38, 135, 0.45)'
                }}
            >
                <Input
                    placeholder="Parlez à United AI..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="none"
                    color="white"
                    fontFamily="Poppins"
                    fontSize="0.95rem"
                    _placeholder={{
                        color: 'whiteAlpha.700',
                        fontFamily: 'Poppins'
                    }}
                    _focus={{
                        boxShadow: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    _hover={{
                        bg: 'rgba(255, 255, 255, 0.08)'
                    }}
                />
            </Box>
        </VStack>
    );
}

export default ChatBox;
