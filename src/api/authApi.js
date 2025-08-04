import { getUserByUsername, addUser } from './userApi';

export const login = async ({ username, password }) => {
    const user = getUserByUsername(username);
    if (!user || user.password !== password) {
        throw new Error('Sai tên đăng nhập hoặc mật khẩu');
    }
    return user;
};

export const register = async (data) => {
    const existingUser = getUserByUsername(data.username);
    if (existingUser) {
        throw new Error('Tên người dùng đã tồn tại');
    }
    return addUser(data);
};
