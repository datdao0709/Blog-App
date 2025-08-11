import React, {useEffect, useCallback, useMemo, useState} from 'react';
import {getAllPosts} from '../../api/postApi';
import PostItem from '../../components/PostItem';
import {Empty, List, Typography, Card, message} from 'antd';
import "../../assets/style/global.css"


const {Title} = Typography;

const sortPostsNewestFirst = (posts = []) => [...posts].sort((a, b) => {
    const ta = a.updatedAt || a.createdAt || '';
    const tb = b.updatedAt || b.createdAt || '';
    return !ta && !tb ? 0 : !ta ? 1 : !tb ? -1 : new Date(tb).getTime() - new Date(ta).getTime();
});

const PostList = ({isAuthenticated = false}) => {
    const [posts, setPosts] = useState([]);
    const fetchPosts = useCallback(() => {
        try {
            const allPosts = getAllPosts() || [];
            const filtered = isAuthenticated ? allPosts : allPosts.filter(p => p.isPublic);
            setPosts(sortPostsNewestFirst(filtered));
        } catch (err) {
            console.error('Lỗi khi lấy danh sách bài viết:', err);
            message.error('Không thể tải danh sách bài viết.');
            setPosts([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDeleted = useCallback(() => {
        message.success('Danh sách đã được cập nhật.');
        fetchPosts();
    }, [fetchPosts]);

    const memoizedPosts = useMemo(() => posts, [posts]);

    return (
        <Card className="post-list-card">
            <Title level={3} className="post-list-title">Danh sách bài viết</Title>
            {memoizedPosts.length > 0 ? (
                <List
                    pagination={{pageSize: 5}}
                    dataSource={memoizedPosts}
                    renderItem={(post) => <PostItem key={post.id} post={post} onDeleted={handleDeleted}/>}
                />
            ) : (
                <Empty description="Không có bài viết nào."/>
            )}
        </Card>
    );
};

export default PostList;
