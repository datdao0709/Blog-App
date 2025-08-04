import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import PostDetail from '../pages/PostDetail';
import PrivateRoute from './PrivateRoute';

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Trang chi tiết bài viết */}
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* Các route yêu cầu đăng nhập */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/create"
                element={
                    <PrivateRoute>
                        <CreatePost />
                    </PrivateRoute>
                }
            />
            <Route
                path="/edit/:id"
                element={
                    <PrivateRoute>
                        <EditPost />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoute;
