import React from "react";
import { Box } from "@mui/material";

const Navbar :React.FC= () => {
    return (
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
    )
}

export default Navbar;