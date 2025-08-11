import React, {useState} from 'react';
import {Button, Form, Input, Alert, message} from 'antd';
import {register as apiRegister} from '../../api/userApi';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setError('');
        setLoading(true);
        try {
            if (values.password !== values.confirmPassword) {
                setError('Mật khẩu và xác nhận mật khẩu không khớp!');
                return;
            }
            await apiRegister({username: values.username, password: values.password, email: values.email});
            message.success('Đăng ký thành công!');
            form.resetFields();
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại, vui lòng thử lại.');
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
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    rules={[
                        {required: true, message: 'Vui lòng xác nhận mật khẩu!'},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" style={{width: '100%', maxWidth: '300px'}}/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!'}]}
                >
                    <Input placeholder="Nhập email" style={{width: '100%', maxWidth: '300px'}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}
                            style={{width: '100%', maxWidth: '300px'}}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
            <p style={{marginTop: 16, textAlign: 'left'}}>
                Đã có tài khoản?{' '}
                <button onClick={() => navigate('/login')} className="link-button" style={{padding: '0 5px'}}>
                    Đăng nhập ngay
                </button>
            </p>
        </div>
    );
};

export default Register;