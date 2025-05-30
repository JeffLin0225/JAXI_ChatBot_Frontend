import React , {useState} from "react";
import { Box } from "@mui/material";
import { messageInteraction } from "./api/chatApi"; // 字串交互 api
import Navbar from "./components/Navbar"
import ChatArea from "./components/ChatArea"
import InputArea from './components/InputArea'
import {MessageType} from './types/types'

const Appp :React.FC = () => {
    const [input , setInput] = useState<string>('');
    const [messages , setMessages] = useState<MessageType[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    const [selectedImage , setSelectedImage] = useState<File|any>();
    const [imagePreview , setImagePreview] = useState<string|null>();
    const [isDeepSearch , setIsDeepSearch] = useState<boolean>(false);

    /*
        處理圖片
    */
    const handleImageUpload =(event :React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0];
        if(file){
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    const handleRemoveImage =()=>{
        setSelectedImage(null);
        setImagePreview(null);
    }

    /*
        控制深度搜索
    */
    const switchDeepSearch =()=>{
        setIsDeepSearch((prev) => (prev === true ? false:true ));
    }

    /*
       控制發送對話 
    */
    const handleSend = async()=>{
        if(input.trim() === '' && !selectedImage) return; // 如果沒有任何輸出跟上傳圖片 return

        const userMessage: MessageType ={   // 定義： 使者輸入內容（文字,圖片）
            sender: 'You',
            text:   input || (selectedImage ? '已上傳圖片':''),
            image:  selectedImage? URL.createObjectURL(selectedImage):undefined ,
        }

        setMessages([...messages , userMessage]);
        setInput('');
        setSelectedImage(null);
        setImagePreview(null);
        setLoading(true);

        let boxText :string = '';           // 回應內容
        let isFirstChunk :boolean = true;   // 為第一個字塊

        try{
            await messageInteraction(
                input,
                (chunk :string)=>{
                    if(isFirstChunk){
                        setLoading(false);
                        isFirstChunk = false;
                    }
                    boxText += chunk;
                    setMessages(
                        (prev) => {
                            const updatedMessages = [...prev];
                            const lastMessage = updatedMessages[updatedMessages.length-1] // 最後一個字 = 最後更新的那個字
                            if(lastMessage && lastMessage.sender === 'Bot'){
                                lastMessage.text = boxText;
                            }else{
                                updatedMessages.push({sender:'Bot' , text:boxText});
                            }
                            return updatedMessages
                        } 
                    );
                },
                selectedImage,
                isDeepSearch,
            );
        }catch(error){
            setLoading(false);
            const errorMessage :MessageType ={
                sender: 'Bot',
                text:   `錯誤${(error as Error).message}`,
            }
            setMessages((prev)=>[...prev , errorMessage]);
        }finally{
            setLoading(false);
            setIsDeepSearch(false);
        }

    }

    /*
        使用 Enter輸入（有防呆機制）
    */
    const onEnterKeyPress =(event :React.KeyboardEvent)=>{
        if(event.key==='Enter' &&  !event.shiftKey && !loading ){
            event.preventDefault();
            handleSend();
        }
    }

    return (
        // <Box 
        //     sx={{
        //         minHeight: '100vh',
        //         display: 'flex',
        //         flexDirection: 'column',
        //         width: '100%',
        //         // backgroundColor: '#212121',
        //     }}
        // >
            
        // </Box>
        // 先不把區塊丟裡面看看是否解掉文字跳動問題 
        <div>
            <Navbar/>
            <ChatArea
                message ={messages}
                loading ={loading}
                isDeepSearch ={isDeepSearch}
            />
            <InputArea
                input ={input}
                setInput ={setInput}
                loading ={loading}
                imagePreview ={imagePreview}
                isDeepSearch ={isDeepSearch}
                onImageUpload ={handleImageUpload}
                onRemoveImage ={handleRemoveImage}
                onSwitchDeepSearch ={switchDeepSearch}
                onSendMessage ={handleSend}
                onKeyPress ={onEnterKeyPress}
            />
        </div>
    )
}

export default Appp;