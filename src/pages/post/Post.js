import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Button, Modal, Typography, message, Card, Space} from 'antd';
import sanitizeHtml from 'sanitize-html';
import PostForm from '../../components/PostForm';
import {createPost, getPostById, updatePost, deletePost} from '../../api/postApi';
import {htmlToReact} from '../../utils/htmlToReact';
import useAuth from '../../hooks/useAuth';
import "../../assets/style/global.css"

const {Title} = Typography;

const Post = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [initialData, setInitialData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        if (id) {
            const post = getPostById(id);
            if (post) {
                setInitialData(post);
                setIsViewMode(window.location.pathname.startsWith('/posts/'));
            } else {
                Modal.error({title: 'Lỗi', content: 'Không tìm thấy bài viết!', onOk: () => navigate('/')});
            }
        } else {
            setInitialData(null);
            setIsViewMode(false);
        }
    }, [id, navigate]);

    const handleSubmit = (data) => {
        try {
            if (id) {
                updatePost(id, data);
                message.success('Cập nhật bài viết thành công.');
            } else {
                createPost({...data, authorId: user?.id, authorName: user?.name || user?.username});
                message.success('Tạo bài viết thành công.');
            }
            navigate('/');
        } catch (err) {
            message.error(err.message || 'Có lỗi khi lưu bài viết.');
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xoá bài viết?', content: 'Hành động này không thể hoàn tác!',
            okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ',
            onOk: () => {
                try {
                    deletePost(id);
                    message.success('Xoá bài viết thành công.');
                    navigate('/');
                } catch (err) {
                    message.error(err.message || 'Không thể xoá bài viết.');
                }
            }
        });
    };

    if (isViewMode && initialData) {
        const safeHtml = sanitizeHtml(initialData.content || '', {
            allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'blockquote', 'code', 'pre'],
            allowedAttributes: {a: ['href', 'target', 'rel', 'title']},
            transformTags: {
                'a': (tagName, attribs) => attribs?.href?.startsWith('http') ? {
                    tagName: 'a',
                    attribs: {...attribs, target: '_blank', rel: 'noopener noreferrer'}
                } : {tagName: 'a', attribs}
            }
        });

        const isAuthor = user && (initialData.authorId && String(initialData.authorId) === String(user.id) || !initialData.authorId && initialData.author === user.username);

        return (
            <div className="post-container">
                <Card>
                    <Title level={2}>{initialData.title}</Title>
                    <div className="post-content">
                        {htmlToReact(safeHtml) ||
                            <div dangerouslySetInnerHTML={{__html: safeHtml}}/>}
                    </div>
                    <div className="post-author-info">
                        Tác
                        giả: {initialData.authorName || initialData.author} · {initialData.createdAt ? new Date(initialData.createdAt).toLocaleString() : ''}
                    </div>
                    {isAuthor ? (
                        <Space>
                            <Button type="primary" onClick={() => navigate(`/edit/${id}`)}>Chỉnh sửa</Button>
                            <Button danger onClick={handleDelete}>Xoá</Button>
                        </Space>
                    ) : (
                        <div className="post-info-message">
                            {user ? 'Bạn không phải là tác giả nên không thể chỉnh sửa bài này.' : 'Đăng nhập để quản lý bài viết của bạn.'}
                        </div>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <div className="post-container">
            <Card>
                <h2>{id ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
                <PostForm initialData={initialData || {}} onSubmit={handleSubmit}/>
                {id && <div className="post-delete-button"><Button danger onClick={handleDelete}>Xoá bài viết</Button>
                </div>}
            </Card>
        </div>
    );
};

export default Post;
