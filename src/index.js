import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import 'antd/dist/reset.css';
import './assets/style/global.css';

import {getItem, setItem} from './utils/localStorage';

const initializeData = () => {
    const users = getItem('users', []);
    if (!users.length) {
        setItem('users', [
            {
                id: 'u1',
                name: 'Nguyễn Văn A',
                username: 'vana',
                password: 'hashed123456',
                email: 'vana@example.com',
                role: 'admin',
            },
            {
                id: 'u2',
                name: 'Trần Thị B',
                username: 'tranb',
                password: 'hashedabcdef',
                email: 'tranb@example.com',
                role: 'user',
            },
        ]);
    }

    const posts = getItem('posts', []);
    if (!posts.length) {
        setItem('posts', [
            {
                id: 'b1',
                title: 'Lập trình React từ A đến Z',
                content: `<p>React là thư viện JavaScript phổ biến để xây dựng giao diện người dùng. Nó cho phép bạn tạo các component tái sử dụng, giúp phát triển ứng dụng web nhanh và hiệu quả hơn. Bạn có thể học React từ nhiều nguồn khác nhau, bao gồm tài liệu chính thức và các khóa học trực tuyến.</p>
                  <p>Trong bài viết này, chúng ta sẽ đi qua các bước cơ bản để bắt đầu với React, từ cách tạo component cho đến quản lý state và routing.</p>`,
                authorId: 'u1',
                authorName: 'Nguyễn Văn A',
                isPublic: true,
                createdAt: '2024-07-20T10:00:00.000Z',
            },
            {
                id: 'b2',
                title: 'Kỹ thuật viết API hiệu quả với Node.js',
                content: `<p>Trong bài này, chúng ta sẽ tìm hiểu cách viết API RESTful hiệu quả với Node.js và Express. Việc tổ chức code tốt và áp dụng các kỹ thuật tối ưu giúp API chạy nhanh, bảo mật và dễ bảo trì hơn.</p>
                  <p>Chúng ta sẽ cùng xem các ví dụ cụ thể về routing, middleware và xử lý lỗi.</p>`,
                authorId: 'u2',
                authorName: 'Trần Thị B',
                isPublic: false,
                createdAt: '2024-07-22T14:30:00.000Z',
            },
        ]);
    }

    const comments = getItem('comments', []);
    if (!comments.length) {
        setItem('comments', []);
    }

    const updatedPosts = getItem('posts', []);
    const updatedUsers = getItem('users', []);
    if (updatedPosts.length && updatedUsers.length) {
        let migrated = false;
        const usersByUsername = {};
        updatedUsers.forEach((u) => {
            usersByUsername[u.username] = u;
        });
        const newPosts = updatedPosts.map((p) => {
            if (p.author && !p.authorId) {
                const found = usersByUsername[p.author];
                if (found) {
                    migrated = true;
                    return {...p, authorId: found.id, authorName: found.name};
                }
            }
            return p;
        });
        if (migrated) {
            setItem('posts', newPosts);
            console.info('Migrate: posts updated to use authorId');
        }
    }
};

initializeData();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
