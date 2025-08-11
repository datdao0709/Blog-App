import React from 'react';
import {Layout, Menu, Dropdown, Input} from 'antd';
import {useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import "../assets/style/global.css";

const {Header} = Layout;
const {Search} = Input;

export default function AppHeader() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            logout();
            navigate('/login');
        }
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/profile#basic')}>
                Hồ sơ
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const onSearch = (value) => {
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    };

    return (
        <Header className="header-container">
            <div className="header-left">
                <img
                    src={require('../assets/img/logoApp.jpg')}
                    alt="Logo"
                    className="header-logo"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40';
                        e.target.alt = 'Logo Placeholder';
                    }}
                />
                <Search
                    placeholder="Tìm kiếm bài viết..."
                    onSearch={onSearch}
                    enterButton
                />
            </div>

            <div className="header-right">
                <div className="header-auth-actions">
                    {user ? (
                        <Dropdown
                            overlay={profileMenu}
                            trigger={['hover']}
                            overlayStyle={{minWidth: '150px'}}
                        >
                            <img
                                src={require('../assets/img/avt.jpg')}
                                alt="User Avatar"
                                className="header-avatar"
                                onError={(e) => {
                                    e.target.src = 'https://www.gravatar.com/avatar/?d=mp';
                                }}
                            />
                        </Dropdown>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="auth-action-button login-button"
                            >
                                Đăng nhập
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="auth-action-button register-button"
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Header>
    );
}
