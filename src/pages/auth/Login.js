import React, {useState, useEffect} from 'react';
import {Button, Form, Input, Alert, Checkbox} from 'antd';
import {useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../assets/style/global.css';

const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [remember, setRemember] = useState(false);

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedUsername && savedPassword) {
            form.setFieldsValue({username: savedUsername, password: savedPassword});
            setRemember(true);
        }
    }, [form]);

    const onFinish = async (values) => {
        setError('');
        setLoading(true);
        try {
            const result = await login(values);
            if (result.success) {
                form.resetFields();
                if (remember) {
                    localStorage.setItem('rememberedUsername', values.username);
                    localStorage.setItem('rememberedPassword', values.password);
                } else {
                    localStorage.removeItem('rememberedUsername');
                    localStorage.removeItem('rememberedPassword');
                }
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '400px', margin: '0 auto', padding: '20px'}}>
            {error && <Alert message={error} type="error" style={{marginBottom: 16}}/>}
            <Form form={form} onFinish={onFinish} layout="vertical" style={{width: '100%'}}>
                <Form.Item
                    name="username"
                    label="Tên người dùng"
                    rules={[{required: true, message: 'Vui lòng nhập tên người dùng!'}]}
                >
                    <Input placeholder="Nhập tên người dùng" style={{width: '100%', maxWidth: '300px'}}/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" style={{width: '100%', maxWidth: '300px'}}/>
                </Form.Item>
                <Form.Item>
                    <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>Nhớ mật khẩu</Checkbox>
                    <Button type="primary" htmlType="submit" block loading={loading}
                            style={{width: '100%', maxWidth: '300px', marginTop: '10px'}}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
            <p style={{marginTop: 16, textAlign: 'left'}}>
                Chưa có tài khoản?{' '}
                <button onClick={() => navigate('/register')} className="link-button" style={{padding: '0 5px'}}>
                    Đăng ký ngay
                </button>
            </p>
        </div>
    );
};

export default Login;