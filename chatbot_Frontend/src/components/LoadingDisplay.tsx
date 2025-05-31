import React from "react";
import { Box , Typography } from "@mui/material";
import WifiFindIcon from '@mui/icons-material/WifiFind';

interface LoadingDisplayProps {
    isDeepSearch :boolean;
}

const LoadingDisplay :React.FC<LoadingDisplayProps> = ({isDeepSearch}) => {
    return (<>
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
                    alt="jxicri.png"
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
                    <WifiFindIcon />
                    啟用 DeepSearch ...
                    </Typography>
                )}
            </Box>
        </Box>
        <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>)
}
export default LoadingDisplay;