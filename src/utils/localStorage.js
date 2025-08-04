export const getItem = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error(`Lỗi khi lấy dữ liệu từ localStorage cho key ${key}:`, e);
        return null;
    }
};

export const setItem = (key, value) => {
    try {
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