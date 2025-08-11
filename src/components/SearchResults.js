import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getAllPosts} from "../api/postApi";
import {List, Empty, Card, Typography} from "antd";

const {Title} = Typography;

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search).get("q") || "";

    const posts = getAllPosts().filter(
        (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.content.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <Card>
            <Title level={3}>Kết quả tìm kiếm cho: "{query}"</Title>
            {posts.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={posts}
                    renderItem={(post) => (
                        <List.Item
                            style={{cursor: "pointer"}}
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            <List.Item.Meta
                                title={post.title}
                                description={`Tác giả: ${post.authorName || post.author || "Người dùng"}`}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Không tìm thấy bài viết nào."/>
            )}
        </Card>
    );
}