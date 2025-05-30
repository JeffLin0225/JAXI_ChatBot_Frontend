// chatApi.ts
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://localhost:5001/ask';

export function messageInteraction(
  prompt: string,
  onChunk: (chunk: string) => void,
  image?: File,
  isDeepSearch?: boolean | any
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('question', prompt);
    if (image) {
      formData.append('image', image);
    }

    if(isDeepSearch !== null){
      formData.append('isDeepSearch', isDeepSearch.toString());
    }

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`伺服器回應錯誤：${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('無法獲取回應流');
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                resolve();
              } else {
                onChunk(data); // 傳遞每個字元給前端
              }
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}