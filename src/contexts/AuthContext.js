import {createContext, useState} from 'react';
import {getItem, setItem, removeItem} from '../utils/localStorage';
import {login as apiLogin} from '../api/userApi';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => getItem('currentUser') || null);

    const login = async ({username, password}) => {
        try {
            const result = await apiLogin(username, password);
            if (!result || typeof result !== 'object') {
                throw new Error('Dữ liệu đăng nhập không hợp lệ từ API');
            }
            setUser(result);
            setItem('currentUser', result);
            return {success: true, user: result};
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            return {success: false, message: error?.message || 'Lỗi khi đăng nhập'};
        }
    };

    const logout = () => {
        setUser(null);
        removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{user, login, logout, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};