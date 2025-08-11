import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth phải được sử dụng trong AuthProvider');
    const {user, setUser, login, logout} = context;

    return {user, setUser, login, logout};
};

export default useAuth;