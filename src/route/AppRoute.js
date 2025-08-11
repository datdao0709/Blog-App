import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/Profile';
import PostDetail from '../pages/post/PostDetail';
import PrivateRoute from './PrivateRoute';
import Post from '../pages/post/Post';
import NotFound from '../pages/NotFound';
import SearchResults from '../components/SearchResults';

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/posts/:id" element={<PostDetail/>}/>
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
            <Route path="/create" element={<PrivateRoute><Post/></PrivateRoute>}/>
            <Route path="/edit/:id" element={<PrivateRoute><Post/></PrivateRoute>}/>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/search" element={<SearchResults/>}/>
        </Routes>
    );
};

export default AppRoute;