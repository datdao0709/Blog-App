import React, {useEffect, useState, useCallback} from 'react';
import {List, Typography, Empty, Button, Input, Space, Popconfirm, message, Avatar} from 'antd';
import {getCommentsByPostId, updateComment, deleteComment} from '../api/commentApi';
import useAuth from '../hooks/useAuth';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const {Text} = Typography;

const formatCommentTime = (time) => {
    return dayjs(time).format("DD/MM/YYYY HH:mm");
};

const CommentList = ({postId, onDeleted, onUpdated}) => {
    const [comments, setComments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const {user} = useAuth();

    const load = useCallback(() => {
        const data = getCommentsByPostId(postId) || [];
        setComments(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }, [postId]);

    useEffect(() => {
        load();
        const handler = (e) => {
            if (!e?.detail || String(e.detail.postId) === String(postId)) load();
        };
        window.addEventListener('comment:added', handler);
        window.addEventListener('comment:updated', handler);
        window.addEventListener('comment:deleted', handler);
        return () => {
            window.removeEventListener('comment:added', handler);
            window.removeEventListener('comment:updated', handler);
            window.removeEventListener('comment:deleted', handler);
        };
    }, [postId, load]);

    const startEdit = (c) => {
        const temp = document.createElement('div');
        temp.innerHTML = c.content || '';
        const plainText = temp.textContent || temp.innerText || '';
        setEditValue(plainText);
        setEditingId(c.id);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const saveEdit = async (id) => {
        const text = editValue.trim();
        if (!text) {
            message.error('Nội dung không được để trống.');
            return;
        }
        try {
            const updated = updateComment(id, {content: text});
            message.success('Cập nhật bình luận thành công.');

            setComments((prev) =>
                prev.map((c) => (c.id === id ? updated : c))
            );

            setEditingId(null);
            setEditValue('');

            window.dispatchEvent(
                new CustomEvent('comment:updated', {
                    detail: {postId, comment: updated},
                })
            );
            onUpdated?.(updated);
        } catch (err) {
            message.error(err.message || 'Không thể cập nhật bình luận.');
        }
    };


    const handleDelete = async (id) => {
        try {
            deleteComment(id);
            message.success('Xoá bình luận thành công.');
            load();
            window.dispatchEvent(new CustomEvent('comment:deleted', {detail: {postId, commentId: id}}));
            onDeleted?.(id);
        } catch (err) {
            message.error(err.message || 'Không thể xoá bình luận.');
        }
    };

    return (
        <div style={{marginTop: 48}}>
            <Typography.Title level={4}>Bình luận ({comments.length})</Typography.Title>
            {comments.length ? (
                <List
                    itemLayout="vertical"
                    dataSource={comments}
                    renderItem={(item) => {
                        const isAuthor = user && item.authorId && String(user.id) === String(item.authorId);
                        return (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<Avatar>{(item.author || 'Người dùng').charAt(0).toUpperCase()}</Avatar>}
                                    title={<Text strong>{item.author || 'Người dùng'}</Text>}
                                    description={
                                        <Text type="secondary">
                                            {formatCommentTime(item.createdAt, item.updatedAt)}
                                        </Text>
                                    }
                                />

                                {editingId === item.id ? (
                                    <>
                                        <Input.TextArea
                                            rows={4}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                        />
                                        <Space style={{marginTop: 8}}>
                                            <Button type="primary" onClick={() => saveEdit(item.id)}>Lưu</Button>
                                            <Button onClick={cancelEdit}>Hủy</Button>
                                        </Space>
                                    </>
                                ) : (
                                    <div style={{marginTop: 8}} dangerouslySetInnerHTML={{__html: item.content}}/>
                                )}

                                {isAuthor && editingId !== item.id && (
                                    <Space style={{marginTop: 8}}>
                                        <Button size="small" onClick={() => startEdit(item)}>Sửa</Button>
                                        <Popconfirm
                                            title="Bạn có chắc muốn xoá bình luận?"
                                            onConfirm={() => handleDelete(item.id)}
                                            okText="Xoá"
                                            cancelText="Hủy"
                                        >
                                            <Button danger size="small">Xóa</Button>
                                        </Popconfirm>
                                    </Space>
                                )}
                            </List.Item>
                        );
                    }}
                />
            ) : (
                <Empty description="Chưa có bình luận nào."/>
            )}
        </div>
    );
};

export default CommentList;
