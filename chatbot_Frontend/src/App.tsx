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
      const botText = await sendMessage(input, selectedImage);
      const botMessage: Message = { sender: 'Bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'Bot', text: `錯誤：${(error as Error).message}` };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !loading) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#212121',
        width: '100%',
      }}
    >
      {/* Navbar */}
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
          {/* <Typography
            variant="h2"
            sx={{
              backgroundColor: '#424245',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontStyle: 'oblique'
            }}
          >
            JAXI
          </Typography> */}
        </Box>
      </Box>

      {/* 對話框 */}
      <Box
        sx={{
          flexGrow: 1,
          padding: '20px',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          backgroundColor: '#303030',
        }}
      >
        {messages.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#bbb', mt: '20px' }}>
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
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
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
                  {msg.sender === 'Bot' && (
                    <Box
                    component="img"
                    src="/jxicri.png" // 與 Bot 訊息一致
                    alt="Bot Avatar"
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      mr: '10px',
                    }}
                  />
                  )}
                  {/* 人 , 機*/}
                  <Paper
                    sx={{
                      padding: '10px 15px',
                      backgroundColor: msg.sender === 'You' ? 'rgb(77, 75, 75)' : '#303030',
                      color: '#fff',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px #303030',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
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
                  {/* {msg.sender === 'You' && (
                    <Box
                    component="img"
                    src="/AiLogo.jpg" // 與 Bot 訊息一致
                    alt="Bot Avatar"
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      mr: '10px',
                    }}
                  />
                  )} */}
                </Box>
              </Box>
            ))}
            {/* 圈圈效果 */}
            {loading && (
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
                    src="/AiLogo.jpg" // 與 Bot 訊息一致
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
                      width: '60px', // 更大尺寸
                      height: '60px',
                      border: '7px dotted rgb(237, 248, 35)',
                      borderTop: '4px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite', // 旋轉動畫
                      boxShadow: '0 0 10px rgba(252, 255, 103, 0.93)', // 發光效果
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* 圈圈效果 */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>

      {/* 輸入區域 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          padding: '10px 20px',
          backgroundColor: '#424242',
          borderTop: '1px solid #616161',
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
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
            color="primary"
            component="label"
            disabled={loading}
            sx={{ color: '#fff' ,              '&:hover': { backgroundColor: 'white' ,color:'black'},
          }}
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
              '&:hover': { backgroundColor: 'white' ,color:'black'},
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
    </Box>
  );
};

export default App;