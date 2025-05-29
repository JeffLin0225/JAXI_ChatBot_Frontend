// App.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
  Input,
} from '@mui/material';
import { sendMessage } from './api/chatApi';
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import WifiFindIcon from '@mui/icons-material/WifiFind';

interface Message {
  sender: 'You' | 'Bot';
  text: string;
  image?: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeepSearch , setIsDeepSearch] = useState<boolean | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const toggleDeepSearch = () => {
    setIsDeepSearch((prev) => (prev === true ? null : true)); // 切換 true 和 null
  };

  const handleSend = async () => {
    if (input.trim() === '' && !selectedImage) return;

    const userMessage: Message = {
      sender: 'You',
      text: input || (selectedImage ? '已上傳圖片' : ''),
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      let botText = '';
      let isFirstChunk = true; // 用來標記第一個 chunk
      await sendMessage(
        input,
        (chunk: string) => {
          // console.log('Received chunk:', chunk); // 檢查 chunk 的實際內容
          if (isFirstChunk) {
            setLoading(false); // 第一個 chunk 到達時停止轉圈圈
            isFirstChunk = false;
          }
          botText += chunk; // 累積每個資料塊
          setMessages((prev) => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'Bot') {
              lastMessage.text = botText; // 更新最後一條 Bot 訊息
            } else {
              updatedMessages.push({ sender: 'Bot', text: botText }); // 新增 Bot 訊息
            }
            return updatedMessages;
          });
        },
        selectedImage,
        isDeepSearch
      );
    } catch (error) {
      setLoading(false); // 第一個 chunk 到達時停止轉圈圈
      const errorMessage: Message = { sender: 'Bot', text: `錯誤：${(error as Error).message}` };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false); // 流結束或錯誤時停止 loading
      setIsDeepSearch(null)
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !loading) {
      event.preventDefault();
      handleSend();
    }
  };

  /* 換行函式 */
  const formatTextWithBreaks = (text: any ) => {
  if (!text) return '';
  
  return text
    // 句號、驚嘆號、問號後換行（不管有沒有空格）
    .replace(/([.。！!？?])/g, '$1\n')
    // 冒號後換行
    .replace(/([：:])/g, '$1\n')
    // 分號後換行  
    .replace(/([；;])/g, '$1\n')
    // 特殊格式：**後面跟冒號
    .replace(/(\*\*[^*]+\*\*[：:])/g, '$1\n')
    // 項目符號前換行
    .replace(/(\*\*\*)/g, '\n$1')
    // 清理多餘空行
    .replace(/\n+/g, '\n')
    .trim();
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: '#212121',
        width: '100%',
      }}
    >
      {/* #################################### Navbar  #################################### */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: '#212121',
          padding: '15px 20px',
          borderBottom: '1px solid #424242',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="img"
          src="/AiLogo2.jpg"
          alt="ChatBot Icon"
          sx={{
            width: '120px',
            borderRadius: '10px',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src="/jaxi.jpg"
            alt="ChatBot Icon"
            sx={{
              height: '100px',
              borderRadius: '10px',
            }}
          />
          <Box
            component="img"
            src="/AiLogo.jpg"
            alt="ChatBot Icon"
            sx={{
              width: '100px',
              height: '100px',
              borderRadius: '5px',
            }}
          />
        </Box>
      </Box>
      {/* #################################### Navbar ＥＮＤ #################################### */}

      {/* #################################### 對話框  #################################### */}
      <Box // 對話框範圍
        sx={{
          flexGrow: 1,
          padding: '20px',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          // backgroundColor: '#303030',
        }}
      >
        {messages.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#bbb', mt: '20px' , fontSize: 'large'}}>
            開始聊天吧！
          </Typography>
        ) : (
          <Box // 動態輸出雙方的對話範圍
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {messages.map((msg, index) => (
              <Box //  雙方獨立對話框 div 
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <Box //  雙方獨立對話框 div裡面
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '70%',
                  }}
                >
                  {msg.sender === 'Bot' && (
                    <Box // 頭像框
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
                  <Paper  // 個別的輸出對話框 (重點) 
                    sx={{
                      padding: '10px 15px',
                      backgroundColor: msg.sender === 'You' ? 'rgb(77, 75, 75)' : '#303030',
                      color: '#fff',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px #303030',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      border: '2px solid white'
                    }}
                  >
                    <Typography   // 文字顯示得樣式
                      variant="body1" 
                      sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',  
                            lineHeight: '1.6'
                          }} 
                    > {formatTextWithBreaks(msg.text)} </Typography>
                    {msg.image && (
                      <Box
                        component="img"
                        src={msg.image}
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
            ))}
            {loading && ( // 轉圈圈區
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '70%',
                  }}
                >
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
                  <Box
                    sx={{
                      width: '50px',
                      height: '50px',
                      border: '7px dotted rgb(237, 248, 35)',
                      borderTop: '4px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      boxShadow: '0 0 10px rgba(252, 255, 103, 0.93)',
                    }}
                  />
                  {isDeepSearch === true && (
                      <Typography
                        sx={{
                          color: 'yellow',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          animation: 'pulse 1.5s infinite, gradientText 3s infinite',
                          background: 'linear-gradient(90deg, #ffeb3b, #00e5ff, #ffeb3b)',
                          backgroundSize: '200% 200%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <WifiFindIcon/>
                        啟用 DeepSearch ...
                      </Typography>
                    )}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
      {/* #################################### 對話框區域 ＥＮＤ #################################### */}

      {/* #################################### 輸入區域 #################################### */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          padding: '10px 20px',
          backgroundColor: '#424242',
          borderTop: '1px solid #616161',
          borderRadius: '10px',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          marginBottom : '10px'
        }}
      >
        {imagePreview && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
            <Box
              component="img"
              src={imagePreview}
              sx={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '5px' }}
            />
            <IconButton onClick={handleRemoveImage} sx={{ ml: '10px', color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入訊息..."
            fullWidth
            disabled={loading}
            multiline
            maxRows={4}
            sx={{
              backgroundColor: '#616161',
              borderRadius: '5px',
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#757575' },
                '&:hover fieldset': { borderColor: '#9e9e9e' },
                padding: '8px 14px',
              },
            }}
          />
          <IconButton
            onClick={toggleDeepSearch}
            component="label"
            disabled={loading}
            sx={{ color:isDeepSearch ? 'black': '#fff',borderRadius: '30px',fontSize:'small', backgroundColor: isDeepSearch ? 'white': 'rgb(115, 113, 113)', '&:hover': { backgroundColor: 'white', color: 'black' } }}
          >
            DeepSearch
          </IconButton>
          <IconButton
            color="primary"
            component="label"
            disabled={loading}
            sx={{ color: '#fff', '&:hover': { backgroundColor: 'white', color: 'black' } }}
          >
            <PhotoIcon />
            <Input
              type="file"
              sx={{ display: 'none' }}
              onChange={handleImageUpload}
              inputProps={{ accept: 'image/*' }}
            />
          </IconButton>
          <IconButton
            onClick={handleSend}
            disabled={loading}
            sx={{
              color: 'white',
              backgroundColor: 'rgb(115, 113, 113)',
              padding: '10px',
              '&:hover': { backgroundColor: 'white', color: 'black' },
              '&.Mui-disabled': { backgroundColor: 'white', opacity: 0.6 },
            }}
          >
            <ArrowUpwardIcon
              sx={{
                transform: loading ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        </Box>
      </Box>
      {/* #################################### 輸入區域 ＥＮＤ #################################### */}

    </Box>
  );
};

export default App;