import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getPostById, deletePost} from '../../api/postApi';
import CommentForm from '../../components/CommentForm';
import CommentList from '../../components/CommentList';
import {Button, message, Card, Typography, Space, Row, Col, Modal} from 'antd';
import useAuth from '../../hooks/useAuth';
import sanitizeHtml from 'sanitize-html';
import {htmlToReact} from '../../utils/htmlToReact';
import "../../assets/style/global.css"

const {Title, Text} = Typography;

export default function PostDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const data = getPostById(id);
        if (!data) {
            message.error('Bài viết không tồn tại');
            navigate('/', {replace: true});
        } else {
            setPost(data);
        }
    }, [id, navigate]);

    const handleDelete = () => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xoá bài viết?', content: 'Hành động này không thể hoàn tác.',
            okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ',
            onOk: () => {
                try {
                    deletePost(id);
                    message.success('Xoá bài viết thành công');
                    navigate('/');
                } catch (err) {
                    message.error(err.message || 'Không thể xoá bài viết');
                }
            }
        });
    };

    if (!post) return null;

    const authorDisplay = post.authorName || post.author || 'Người dùng';
    const isAuthor = user && ((post.authorId && user.id && post.authorId === user.id) || (!post.authorId && post.author && user.username && post.author === user.username));
    const safeHtml = sanitizeHtml(post.content || '', {
        allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'blockquote', 'code', 'pre'],
        allowedAttributes: {a: ['href', 'target', 'rel', 'title']},
        transformTags: {
            'a': (tagName, attribs) => attribs.href && attribs.href.startsWith('http') ? {
                tagName: 'a',
                attribs: {...attribs, target: '_blank', rel: 'noopener noreferrer'}
            } : {tagName: 'a', attribs}
        }
    });

    return (
        <Card bordered={false} style={{padding: 16}}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={3}>{post.title}</Title>
                    <div className="post-content">{htmlToReact(safeHtml) || <p>Không có nội dung</p>}</div>
                    <Text type="secondary" className="post-author-info">Tác giả: {authorDisplay}</Text>
                </Col>
                {isAuthor && (
                    <Col span={24} className="post-author-actions">
                        <Space>
                            <Button type="primary" onClick={() => navigate(`/edit/${id}`)}>Chỉnh sửa</Button>
                            <Button danger onClick={handleDelete}>Xoá</Button>
                        </Space>
                    </Col>
                )}
                <Col span={24} className="post-comments-section">
                    <CommentList postId={id}/>
                    <CommentForm postId={id}/>
                </Col>
            </Row>
        </Card>
    );
}
