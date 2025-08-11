import React, {useState} from 'react';
import {Form, Button, Alert, message, Typography} from 'antd';
import {Link} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {addComment} from '../api/commentApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const {Paragraph} = Typography;
const MAX_LENGTH = 2000;

const CommentForm = ({postId, onAdded}) => {
    const {user} = useAuth();
    const [form] = Form.useForm();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        setError('');
        const text = content.trim();
        if (!text) {
            setError('Nội dung bình luận không được để trống.');
            return;
        }
        if (text.length > MAX_LENGTH) {
            setError(`Bình luận quá dài. Vui lòng không vượt quá ${MAX_LENGTH} ký tự.`);
            return;
        }
        if (!user) {
            setError('Vui lòng đăng nhập để bình luận.');
            return;
        }
        setSubmitting(true);
        const key = 'comment:add';
        message.loading({content: 'Đang gửi bình luận...', key});
        try {
            const newComment = addComment(postId, {
                content: text,
                author: user.name || user.username || 'Người dùng',
                authorId: user.id || null,
                timestamp: new Date().toISOString()
            });
            form.resetFields();
            setContent('');
            message.success({content: 'Gửi bình luận thành công!', key, duration: 1.5});
            onAdded?.(newComment);
            window.dispatchEvent(new CustomEvent('comment:added', {
                detail: {
                    postId: String(postId),
                    comment: newComment
                }
            }));
        } catch (err) {
            message.error({content: 'Gửi bình luận thất bại, vui lòng thử lại.'});
            setError('Gửi bình luận thất bại, vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{marginTop: 32}}>
            <Paragraph strong>Thêm bình luận</Paragraph>
            {!user && (
                <Alert type="info"
                       message={<span>Vui lòng <Link to="/login">đăng nhập</Link> để có thể bình luận.</span>}
                       style={{marginBottom: 12}}/>
            )}
            {error && <Alert type="error" message={error} style={{marginBottom: 12}}/>}
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="content" rules={[{required: true, message: 'Nội dung không được để trống.'}]}>
                    <ReactQuill value={content} onChange={setContent} placeholder="Nhập bình luận của bạn..."
                                maxLength={MAX_LENGTH}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting} disabled={!user}>Gửi</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CommentForm;