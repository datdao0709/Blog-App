import React, { useEffect, useState } from 'react';
import { getCommentsByPostId } from '../api/commentApi';
import { formatDate } from '../utils/formatDate';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = () => {
            const data = getCommentsByPostId(postId);
            setComments(data);
        };
        fetchComments();
    }, [postId]);

    return (
        <div className="comment-list">
            <h3>Bình luận ({comments.length})</h3>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <p><strong>{comment.author}</strong> - {formatDate(comment.timestamp)}</p>
                        <p>{comment.content}</p>
                    </div>
                ))
            ) : (
                <p>Chưa có bình luận nào.</p>
            )}
        </div>
    );
};

export default CommentList;