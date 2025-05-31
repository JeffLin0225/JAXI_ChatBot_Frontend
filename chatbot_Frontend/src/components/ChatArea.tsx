import React from "react";
import { Box , Typography } from "@mui/material";
import { MessageType } from "../types/types";
import MessageBubble from "./MessageBubble";
import LoadingDisplay from "./LoadingDisplay";

interface ChatAreaProps {
    message :MessageType[];
    loading :boolean;
    isDeepSearch :boolean;
}

const ChatArea :React.FC<ChatAreaProps> = ({message , loading , isDeepSearch}) => {
    return (
        <Box 
            sx={{
                minHeight: '68vh',
                flexGrow: 1,
                padding: '20px',
                width: '100%',
                maxWidth: 700,
                margin: '0 auto',
            }}
        >
            {message.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: '#bbb', mt: '20px', fontSize: 'large' }}>
                    開始聊天吧！
                </Typography>
                ) : (
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    {message.map((msg , index )=>(
                        <MessageBubble key={index} message={msg}/>
                    ))}
                    {loading && <LoadingDisplay isDeepSearch={isDeepSearch}/>}
                </Box>
                )  
            }
        </Box>
    )
}
export default ChatArea;