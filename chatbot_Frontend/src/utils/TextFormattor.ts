export const TextFormattor = (text: any ) => {
    if (!text) return '';

    return text
        // 句號、驚嘆號、問號後換行（不管有沒有空格）
        .replace(/([.。！!？?])/g, '$1\n')
        // 冒號後換行
        .replace(/([：:])/g, '$1\n')
        // 分號後換行  
        .replace(/([；;])/g, '$1\n')
        // 特殊格式：**後面跟冒號
        .replace(/(\*\*[^*]+\*\*[：:])/g, '$1\n')
        // 項目符號前換行
        .replace(/(\*\*\*)/g, '\n$1')
        // 清理多餘空行
        .replace(/\n+/g, '\n')
        .trim();
};
