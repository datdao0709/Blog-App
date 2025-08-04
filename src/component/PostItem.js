import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
    return (
        <div className="post-item">
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <Link to={`/posts/${post.id}`}>Xem chi tiết</Link>
        </div>
    );
};

export default PostItem;
