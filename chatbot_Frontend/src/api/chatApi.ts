import axios from 'axios';

const API_URL = 'http://your-backend-url/generate';

export async function sendMessage(prompt: string, image?: File): Promise<string> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10000,
    });
    return response.data.response;
  } catch (error) {
    const axiosError = error as any;
    throw new Error(axiosError.response?.data?.message || '無法連接到伺服器');
  }
}