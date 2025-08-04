import { getItem, setItem } from '../utils/localStorage';

// Lấy danh sách người dùng
export const getUsers = () => {
    return getItem('users') || [];
};

// Thêm người dùng mới
export const addUser = (newUser) => {
    const users = getUsers();
    const updatedUsers = [...users, newUser];
    setItem('users', updatedUsers);
    return newUser;
};

// Tìm người dùng theo username
export const getUserByUsername = (username) => {
    const users = getUsers();
    return users.find((u) => u.username === username);
};
