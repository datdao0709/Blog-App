import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, deletePost } from '../api/postApi';
import CommentForm from '../component/CommentForm';
import CommentList from '../component/CommentList';
import { Button, message } from 'antd';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const post = getPostById(id);

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xoá bài viết?')) {
            deletePost(id);
            message.success('Xoá bài viết thành công!').then();
            navigate('/');
        }
    };

    if (!post) return <p>Bài viết không tồn tại</p>;

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <Button type="primary" onClick={() => navigate(`/edit/${id}`)}>Chỉnh sửa</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: 8 }}>Xoá</Button>
            <CommentList postId={id} />
            <CommentForm />
        </div>
    );
}