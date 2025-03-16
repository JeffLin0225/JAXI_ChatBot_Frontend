import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Input,
} from '@mui/material';
import { sendMessage } from './api/chatApi';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

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
          padding: '10px 20px',
          borderBottom: '1px solid #424242',
        }}
      >
        <Typography variant="h5" sx={{ backgroundColor:'#424245' ,color: '#fff',textAlign:'center' }}>
          阿賢聊天機器人 ChatBot
        </Typography>
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
                    <Avatar sx={{ mr: '10px', bgcolor: '#4caf50' }}>B</Avatar>
                  )}
                  <Paper
                    sx={{
                      padding: '10px 15px',
                      backgroundColor: msg.sender === 'You' ? '#0288d1' : '#424242',
                      color: '#fff',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
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
                  {msg.sender === 'You' && (
                    <Avatar sx={{ ml: '10px', bgcolor: '#0288d1' }}>U</Avatar>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
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
            <IconButton
              onClick={handleRemoveImage}
              sx={{ ml: '10px', color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
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
            sx={{ color: '#fff' }}
          >
            <PhotoCamera />
            <Input
              type="file"
              sx={{ display: 'none' }}
              onChange={handleImageUpload}
              inputProps={{ accept: 'image/*' }}
            />
          </IconButton>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={loading}
            endIcon={<SendIcon />}
            sx={{ px: '15px', backgroundColor: '#0288d1' }}
          >
            {loading ? '發送中...' : '發送'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;