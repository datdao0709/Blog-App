import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { addComment } from '../api/commentApi';

const CommentForm = () => {
    const { id: postId } = useParams();
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Nội dung bình luận không được để trống.');
            return;
        }
        if (user) {
            addComment(postId, { content, author: user.username, timestamp: new Date().toISOString() });
            setContent('');
            setError('');
        } else {
            setError('Vui lòng đăng nhập để bình luận.');
        }
    };

    return (
        <div className="comment-form">
            <h3>Thêm bình luận</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                />
                <button type="submit">Gửi</button>
            </form>
        </div>
    );
};

export default CommentForm;