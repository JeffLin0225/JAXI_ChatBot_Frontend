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
import { sendMessage } from '../api/chatApi';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

interface Message {
  sender: 'You' | 'Bot';
  text: string;
  image?: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | any>(null); // 儲存圖片文件
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 圖片預覽 URL

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // 顯示預覽
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null); // 移除預覽
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

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 700,
        margin: '0 auto',
        backgroundColor: '#303030',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      {/* 對話框 */}
      <Box
        sx={{
          flex: 1,
          padding: '15px',
          overflowY: 'auto',
          minHeight: 0,
          background: 'linear-gradient(180deg, #424242 0%, #303030 100%)',
        }}
      >
        {messages.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#bbb', mt: '20%' }}>
            開始聊天吧！
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                mb: '10px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {msg.sender === 'Bot' && (
                  <Avatar sx={{ mr: '10px', bgcolor: '#4caf50' }}>B</Avatar>
                )}
                <Paper
                  sx={{
                    padding: '10px 15px',
                    maxWidth: '70%',
                    backgroundColor: msg.sender === 'You' ? '#0288d1' : '#424242',
                    color: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  {msg.image && (
                    <Box
                      component="img"
                      src={msg.image}
                      sx={{ maxWidth: '100%', mt: '10px', borderRadius: '5px' }}
                    />
                  )}
                </Paper>
                {msg.sender === 'You' && (
                  <Avatar sx={{ ml: '10px', bgcolor: '#0288d1' }}>U</Avatar>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* 輸入區域 */}
      <Box
        sx={{
          padding: '10px',
          borderTop: '1px solid #616161',
          backgroundColor: '#424242',
          position: 'sticky',
          bottom: 0,
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        }}
      >
        {/* 圖片預覽 */}
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

        {/* 輸入框和按鈕 */}
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="輸入訊息..."
            fullWidth
            disabled={loading}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: '#616161',
              borderRadius: '5px',
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#757575' },
                '&:hover fieldset': { borderColor: '#9e9e9e' },
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

export default Chat;