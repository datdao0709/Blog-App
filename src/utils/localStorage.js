export const getItem = (key, defaultValue = null) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Lỗi khi lấy dữ liệu từ localStorage cho key ${key}:`, e);
        return defaultValue;
    }
};

export const setItem = (key, value) => {
    try {
        if (new Blob([JSON.stringify(value)]).size > 1024 * 1024) console.warn(`Dữ liệu cho key ${key} vượt 1MB, có thể gây lỗi localStorage.`);
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Lỗi khi lưu dữ liệu vào localStorage cho key ${key}:`, e);
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(`Lỗi khi xóa dữ liệu từ localStorage cho key ${key}:`, e);
    }
};