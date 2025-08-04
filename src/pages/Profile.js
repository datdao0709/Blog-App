import React from 'react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return <p>Vui lòng đăng nhập để xem hồ sơ.</p>;

    return (
        <div className="profile-page">
            <h2>Hồ sơ của bạn</h2>
            <p><strong>Tên người dùng:</strong> {user.username}</p>
            {user.name && <p><strong>Họ tên:</strong> {user.name}</p>}
            <button onClick={logout}>Đăng xuất</button>
        </div>
    );
};

export default Profile;