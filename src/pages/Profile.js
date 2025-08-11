import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Form, Input, message, Space, Tabs, Modal, Radio} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {updateUser, deleteUser, getUserByUsername, getUsers} from '../api/userApi';
import {getItem, setItem} from '../utils/localStorage';
import '../assets/style/global.css';


const Profile = () => {
    const {user, setUser, logout} = useAuth();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [delModalVisible, setDelModalVisible] = useState(false);
    const [delMode, setDelMode] = useState('anonymize');
    const initialHash = (location.hash || '').replace('#', '') || 'basic';
    const [activeTab, setActiveTab] = useState(initialHash);

    useEffect(() => {
        const hash = (location.hash || '').replace('#', '') || 'basic';
        setActiveTab(hash);
    }, [location.hash]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                about: user.about || ''
            });
        }
    }, [user, form]);

    const handleTabChange = (key) => {
        navigate(`${location.pathname}#${key}`, {replace: true});
        setActiveTab(key);
    };

    const onFinish = (values) => {
        setLoading(true);
        try {
            if (!user?.id) throw new Error('User không hợp lệ hoặc không có ID!');
            if (values.username && values.username !== user.username) {
                const existed = getUserByUsername(values.username);
                if (existed?.id !== user.id) throw new Error('Tên người dùng đã tồn tại, vui lòng chọn tên khác.');
            }
            const updatedUser = updateUser(user.id, values);
            const posts = getItem('posts', []);
            const updatedPosts = posts.map(p =>
                p.authorId === updatedUser.id
                    ? {...p, authorName: updatedUser.name || updatedUser.username}
                    : p
            );
            setItem('posts', updatedPosts);
            setUser(updatedUser);
            setItem('currentUser', updatedUser);
            message.success('Cập nhật thông tin thành công!');
            form.setFieldsValue(updatedUser);
        } catch (err) {
            message.error(err.message || 'Có lỗi xảy ra khi cập nhật.');
            if (user) form.setFieldsValue(user);
        } finally {
            setLoading(false);
        }
    };

    const [pwdForm] = Form.useForm();
    const [pwdLoading, setPwdLoading] = useState(false);

    const onChangePassword = (values) => {
        setPwdLoading(true);
        try {
            if (!user?.id) throw new Error('User không hợp lệ!');
            const {currentPassword, newPassword, confirm} = values;
            if (newPassword !== confirm) throw new Error('Mật khẩu mới và xác nhận không trùng nhau.');
            const users = getUsers();
            const me = users.find(u => u.id === user.id);
            if (!me || me.password !== currentPassword) throw new Error('Mật khẩu hiện tại không đúng.');
            const updatedUser = updateUser(user.id, {password: newPassword});
            setUser(updatedUser);
            setItem('currentUser', updatedUser);
            message.success('Đổi mật khẩu thành công!');
            pwdForm.resetFields();
        } catch (err) {
            message.error(err.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setPwdLoading(false);
        }
    };

    const confirmDelete = () => {
        try {
            if (!user?.id) throw new Error('User không hợp lệ!');
            deleteUser(user.id, delMode);
            logout();
            message.success('Tài khoản đã được xử lý.');
            setDelModalVisible(false);
            navigate('/login');
        } catch (err) {
            message.error(err.message || 'Không thể xoá tài khoản.');
        }
    };

    if (!user) {
        return (
            <Card>
                <p>Vui lòng đăng nhập để xem hồ sơ.</p>
            </Card>
        );
    }

    const tabItems = [
        {
            key: 'basic',
            label: 'Thông tin cơ bản',
            children: (
                <>
                    <Form.Item name="username" label="Tên người dùng" rules={[{required: true}]}>
                        <Input className="profile-input"/>
                    </Form.Item>
                    <Form.Item name="name" label="Họ tên" rules={[{required: true}]}>
                        <Input className="profile-input"/>
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                        <Input className="profile-input"/>
                    </Form.Item>
                </>
            )
        },

        {
            key: 'about',
            label: 'Giới thiệu',
            children: (
                <Form.Item name="about" label="Giới thiệu bản thân">
                    <Input.TextArea rows={4} className="profile-textarea"/>
                </Form.Item>
            )
        },
        {
            key: 'security',
            label: 'Bảo mật',
            children: (
                <Form form={pwdForm} layout="vertical" onFinish={onChangePassword}>
                    <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{required: true}]}>
                        <Input.Password className="profile-input"/>
                    </Form.Item>
                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{required: true, min: 6}]}>
                        <Input.Password className="profile-input"/>
                    </Form.Item>
                    <Form.Item name="confirm" label="Xác nhận mật khẩu mới" rules={[{required: true, min: 6}]}>
                        <Input.Password className="profile-input"/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={pwdLoading}>
                        Đổi mật khẩu
                    </Button>
                </Form>
            )
        }
    ];

    return (
        <>
            <Card title="Hồ sơ cá nhân" bordered={false}>
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Tên người dùng">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="Họ tên">{user.name || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email || '-'}</Descriptions.Item>
                </Descriptions>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="profile-form"
                >
                    <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems}/>
                    {activeTab !== 'security' && (
                        <Space className="profile-actions">
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Lưu thay đổi
                            </Button>
                            <Button
                                onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn đăng xuất?')) logout();
                                }}
                            >
                                Đăng xuất
                            </Button>
                            <Button danger type="dashed" onClick={() => setDelModalVisible(true)}>
                                Xoá tài khoản
                            </Button>
                        </Space>
                    )}
                </Form>
            </Card>
            <Modal
                title="Xóa tài khoản"
                open={delModalVisible}
                onCancel={() => setDelModalVisible(false)}
                onOk={confirmDelete}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Chọn cách xử lý khi xoá tài khoản:</p>
                <Radio.Group onChange={(e) => setDelMode(e.target.value)} value={delMode}>
                    <Radio value="hard">Xóa hẳn</Radio>
                    <Radio value="anonymize">Ẩn danh</Radio>
                    <Radio value="keep">Giữ nguyên</Radio>
                </Radio.Group>
            </Modal>
        </>
    );
};

export default Profile;
