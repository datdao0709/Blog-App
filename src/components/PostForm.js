import React, {useEffect, useState, useMemo} from 'react';
import {Form, Input, Button, Checkbox, message, Alert} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';
import useAuth from '../hooks/useAuth';

export default function PostForm({initialData = {}, onSubmit}) {
    const [form] = Form.useForm();
    const {user} = useAuth();
    const [error, setError] = useState('');
    const [content, setContent] = useState(initialData.content || '');

    useEffect(() => {
        form.setFieldsValue({
            title: initialData.title || '',
            isPublic: initialData.isPublic !== undefined ? initialData.isPublic : true
        });
        setContent(initialData.content || '');
    }, [initialData, form]);

    const isContentEmpty = useMemo(() => {
        const plain = sanitizeHtml(content, {allowedTags: [], allowedAttributes: {}}).trim();
        return plain.length === 0;
    }, [content]);

    const handleFinish = (values) => {
        setError('');
        const title = (values.title || '').trim();
        if (!title) {
            setError('Tiêu đề không được để trống.');
            return;
        }
        if (isContentEmpty) {
            setError('Nội dung không được để trống.');
            return;
        }
        const payload = {...initialData, title, content, isPublic: !!values.isPublic};
        if (!initialData.id) {
            payload.authorId = user?.id || null;
            payload.authorName = user?.name || user?.username || 'Người dùng';
        } else {
            payload.updatedAt = new Date().toISOString();
        }
        try {
            onSubmit(payload);
            form.resetFields();
            setContent('');
        } catch (err) {
            message.error(err.message || 'Lỗi khi lưu bài viết.');
        }
    };

    return (
        <div>
            {error && <Alert type="error" message={error} style={{marginBottom: 16}}/>}
            <Form form={form} onFinish={handleFinish} layout="vertical" initialValues={{isPublic: true}}>
                <Form.Item name="title" label="Tiêu đề" rules={[{required: true, message: 'Vui lòng nhập tiêu đề!'}]}>
                    <Input placeholder="Nhập tiêu đề bài viết"/>
                </Form.Item>
                <Form.Item label="Nội dung">
                    <ReactQuill value={content} onChange={setContent} placeholder="Nhập nội dung bài viết..."/>
                </Form.Item>
                <Form.Item name="isPublic" valuePropName="checked">
                    <Checkbox>Public</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                </Form.Item>
            </Form>
        </div>
    );
}