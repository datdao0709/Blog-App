import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../component/PostForm';
import { getPostById, updatePost } from '../api/postApi';
import { message } from 'antd';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleUpdate = (data) => {
        updatePost(id, { ...data, timestamp: new Date().toISOString() });
        message.success('Cập nhật bài viết thành công!').then();
        navigate('/');
    };

    return (
        <div>
            <h2>Chỉnh sửa bài viết</h2>
            <PostForm initialData={getPostById(id) || {}} onSubmit={handleUpdate} />
        </div>
    );
}