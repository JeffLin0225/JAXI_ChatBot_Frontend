import React from "react";
import { Box , Typography , Paper} from "@mui/material";
import { MessageType } from "../types/types";
import { TextFormattor } from "../utils/TextFormattor"

interface MessageBubbleProps {
    message : MessageType;
}
const MessageBubble :React.FC<MessageBubbleProps> = ({message}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                width: '100%'
            }}
        >
            <Box
                sx={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '70%',
                }}
            >
                
            </Box>
        </Box>
    )
}
export default MessageBubble;