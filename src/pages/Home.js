import React from 'react';
import PostList from '../pages/post/PostList';
import useAuth from '../hooks/useAuth';
import {Typography, Layout} from 'antd';

const {Title} = Typography;
const {Content} = Layout;

const Home = () => {
    const {user} = useAuth();

    return (
        <Layout className="home-page">
            <Content className="home-page-content">
                <Title level={2}>Trang chủ</Title>
                <PostList isAuthenticated={!!user}/>
            </Content>
        </Layout>
    );
};

export default Home;