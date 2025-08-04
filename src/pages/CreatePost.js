import { useNavigate } from 'react-router-dom';
import { addPost } from '../api/postApi';
import PostForm from '../component/PostForm';
import { message } from 'antd';

const CreatePost = () => {
    const navigate = useNavigate();

    const handleSubmit = (data) => {
        try {
            addPost({ ...data, timestamp: new Date().toISOString() });
            message.success('Thêm bài viết thành công!').then();
            navigate('/');
        } catch (err) {
            message.error('Đã xảy ra lỗi khi tạo bài viết.').then();
        }
    };

    return (
        <div className="container">
            <h2>Thêm Bài Viết Mới</h2>
            <PostForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreatePost;