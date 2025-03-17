import axios from 'axios';

const API_URL = 'http://localhost:5001/ask';

export async function sendMessage(prompt: string, image?: File): Promise<string> {
  const formData = new FormData();
  formData.append('question', prompt);
  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.answer;
  } catch (error) {
    const axiosError = error as any;
    throw new Error(axiosError.response?.data?.message || '無法連接到伺服器');
  }
}