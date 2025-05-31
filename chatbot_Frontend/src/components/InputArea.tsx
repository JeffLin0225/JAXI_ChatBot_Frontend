import React from "react";
import { Box , TextField , IconButton , Input } from "@mui/material";
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface InputAreaProps {
    input :string;
    setInput :(value:string) => void;
    loading :boolean;
    imagePreview :string|null;
    isDeepSearch :boolean;
    onImageUpload :(event :React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage :() => void;
    onSwitchDeepSearch :() => void;
    onSendMessage :() => void;
    onKeyPress :(event :React.KeyboardEvent) => void;
} 

const InputArea :React.FC<InputAreaProps> = ({
    input ,
    setInput ,
    loading ,
    imagePreview ,
    isDeepSearch ,
    onImageUpload ,
    onRemoveImage ,
    onSwitchDeepSearch ,
    onSendMessage ,
    onKeyPress ,
}) => {
    return (
        // 輸入最外圍區域
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
                marginBottom: '10px'
            }}
        >
            {/* 圖片預覽 */}
            {imagePreview && (
                // 圖片顯示區域
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}> 
                    <Box // 圖片
                        component="img"
                        src={imagePreview}
                        sx={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '5px' }}
                    />
                    {/* 關閉按鈕 */}
                    <IconButton onClick={onRemoveImage} sx={{ ml: '10px', color: '#fff' }}>
                        <CloseIcon/> 
                    </IconButton>
                </Box>
            )}

            {/* 輸入組合 div 框 */}
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
                {/* 輸入區域 */}
                <TextField 
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder="請輸入訊息..."
                    fullWidth
                    disabled = {loading}
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

                {/* DeepSearch 按鈕 */}
                <IconButton
                    onClick={onSwitchDeepSearch}
                    disabled={loading}
                    sx={{
                        color: isDeepSearch ? 'black' : '#fff',
                        borderRadius: '30px',
                        fontSize: 'small',
                        backgroundColor: isDeepSearch ? 'white' : 'rgb(115, 113, 113)',
                        '&:hover': { backgroundColor: 'white', color: 'black' }
                    }}
                >
                    DeepSearch
                </IconButton>

                {/* 上傳圖片 按鈕 */}
                <IconButton
                    color="primary"
                    component="label"
                    disabled={loading}
                    sx={{
                        color: '#fff',
                        '&:hover': { backgroundColor: 'white', color: 'black' }
                    }}
                >
                    <PhotoIcon/>
                    <Input 
                        type="file"
                        sx={{ display: 'none' }}
                        onChange={onImageUpload}
                        inputProps={{ accept: 'image/*' }}
                    />
                </IconButton>

                {/* 發送按鈕 */}
                <IconButton
                    onClick={onSendMessage}
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
    )
}
export default InputArea;