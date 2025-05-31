import React from "react";
import { Box , Typography , Paper} from "@mui/material";
import { MessageType } from "../types/types";
import { textFormattor } from "../utils/TextFormattor"

/*
    [封裝Props元件]
    目的為了針對元件的型態可以客製化組合
*/
interface MessageBubbleProps { 
    message : MessageType;
}

/*
    處理單個訊息顯示樣態
*/
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
                {message.sender === 'Bot' && (
                    <Box
                        component="img"
                        src="/jxicri.png"
                        alt="Bot Avatar"
                        sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            mr: '10px',
                        }}
                    />
                )}

                <Paper // 使用者與機器人問題區域
                    sx={{
                        padding: '10px 15px',
                        backgroundColor: message.sender === 'You' ? 'rgb(77, 75, 75)' : 'black',
                        color: '#fff',
                        borderRadius: '15px',
                        boxShadow: '0 1px 3px #303030',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        border: message.sender === 'Bot' ? '2px solid white' : 'black'
                    }}
                >
                    <Typography // 文字顯示 (SSE)
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',     // 保留所有空白和換行，且會自動換行 
                            wordBreak: 'break-word',    // 優先在正常斷點換行，必要時才切斷單詞
                            overflowWrap: 'break-word', // 優先在正常斷點換行，必要時才切斷單詞
                            lineHeight: '1.6'
                        }}
                    >
                        {textFormattor(message.text)}    
                    </Typography>

                    {message.image && ( // 圖片顯示(目前無此功能)
                        <Box
                            component="img"
                            src={message.image}
                            sx={{
                                maxWidth: '100%',
                                mt: '10px',
                                borderRadius: '5px',
                                display: 'block', 
                            }}
                        />
                    )}
                </Paper>
            </Box>
        </Box>
    )
}
export default MessageBubble;