import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, Typography, Button, Space, Modal, message} from 'antd';
import useAuth from '../hooks/useAuth';
import {deletePost} from '../api/postApi';

const {Paragraph, Text} = Typography;

const PostItem = ({post, onDeleted}) => {
    const {user} = useAuth();
    const navigate = useNavigate();

    const authorName = post.authorName || post.author || 'Người dùng';
    const isAuthor = user && (post.authorId ? post.authorId === user.id : post.author === user.username);

    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xoá bài viết',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            centered: true,
            onOk: () => {
                try {
                    deletePost(post.id);
                    message.success('Xoá bài viết thành công!');
                    onDeleted?.(post.id);
                } catch (err) {
                    message.error(err.message || 'Xoá bài viết thất bại.');
                }
            }
        });
    };

    return (
        <Card title={post.title} style={{marginBottom: 16}} hoverable>
            <Paragraph ellipsis={{rows: 2}}>
                {post.summary || (post.content && post.content.replace(/<[^>]+>/g, '').substring(0, 150)) || ''}
            </Paragraph>
            <Space wrap>
                <Button type="default" onClick={() => navigate(`/posts/${post.id}`)}>
                    Xem chi tiết
                </Button>
                {isAuthor && (
                    <>
                        <Button type="primary" onClick={() => navigate(`/edit/${post.id}`)}>
                            Sửa
                        </Button>
                        <Button danger size="middle" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </>
                )}
            </Space>
            <div style={{marginTop: 8}}>
                <Text type="secondary">Tác giả: {authorName}</Text>
            </div>
        </Card>
    );
};

export default PostItem;
