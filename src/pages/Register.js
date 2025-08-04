import { register as registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            await registerApi(values);
            message.success('Đăng ký thành công');
            navigate('/login');
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="name"
                    label="Họ tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input />
                </Form.Item>
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
                    <Button type="primary" htmlType="submit">Đăng ký</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;