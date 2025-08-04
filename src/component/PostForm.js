import { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';

export default function PostForm({ initialData = {}, onSubmit }) {
    const [form] = Form.useForm();
    const [error, setError] = useState('');

    useEffect(() => {
        form.setFieldsValue({
            title: initialData.title || '',
            content: initialData.content || '',
        });
    }, [initialData, form]);

    const handleFinish = (values) => {
        if (!values.title.trim() || !values.content.trim()) {
            setError('Tiêu đề và nội dung không được để trống.');
            return;
        }
        onSubmit(values);
        form.resetFields();
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                    <Input placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>
                <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input.TextArea rows={5} placeholder="Nhập nội dung bài viết" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}