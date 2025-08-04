import { login as loginApi } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            const user = await loginApi(values);
            login(user);
            message.success('Đăng nhập thành công');
            navigate('/');
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Đăng nhập</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;