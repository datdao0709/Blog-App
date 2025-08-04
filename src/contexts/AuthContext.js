import { createContext, useEffect, useState } from 'react';
import { getItem, setItem, removeItem } from '../utils/localStorage';
import { getUserByUsername } from '../api/userApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getItem('user') || null);

    const login = async ({ username, password }) => {
        const user = await getUserByUsername(username);
        if (user && user.password === password) {
            setUser(user);
            setItem('user', user);
            return { success: true };
        }
        return { success: false, message: 'Sai tài khoản hoặc mật khẩu' };
    };

    const logout = () => {
        setUser(null);
        removeItem('user');
    };

    useEffect(() => {
        const storedUser = getItem('user');
        if (storedUser) setUser(storedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
