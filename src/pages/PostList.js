import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../api/postApi';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            const data = getAllPosts();
            setPosts(data);
        };
        fetchData();
    }, []);

    return (
        <Row gutter={[16, 16]}>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Col xs={24} sm={12} md={8} key={post.id}>
                        <Card
                            title={post.title}
                            extra={<Link to={`/posts/${post.id}`}>Xem chi tiết</Link>}
                            style={{ marginBottom: 16 }}
                        >
                            <p>{post.content.substring(0, 100)}...</p>
                            <p><small>Đăng lúc: {formatDate(post.timestamp)}</small></p>
                        </Card>
                    </Col>
                ))
            ) : (
                <p>Không có bài viết nào.</p>
            )}
        </Row>
    );
};

export default PostList;