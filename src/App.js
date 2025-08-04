import Header from './component/Header';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import AppRoute from './route/AppRoute';
import useAuth from './hooks/useAuth';

const { Header: AntHeader, Content, Sider } = Layout;

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
        ...(user
            ? [
                { key: '/profile', icon: <UserOutlined />, label: 'Hồ sơ' },
                { key: '/create', icon: <PlusOutlined />, label: 'Thêm bài viết' },
            ]
            : []),
    ];

    const handleMenuClick = (e) => {
        const { key } = e;
        if (key === 'logout') {
            logout();
            navigate('/login');
        } else {
            navigate(key);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => console.log('Breakpoint:', broken)}
                onCollapse={(collapsed, type) => console.log('Collapse:', collapsed, type)}
            >
                <div
                    className="logo"
                    style={{
                        height: '32px',
                        margin: '16px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px'
                    }}
                />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
                {user && (
                    <Menu
                        theme="dark"
                        mode="inline"
                        style={{ marginTop: 'auto' }}
                        items={[{ key: 'logout', label: 'Đăng xuất' }]}
                        onClick={handleMenuClick}
                    />
                )}
            </Sider>
            <Layout>
                <AntHeader style={{ background: '#fff' }}>
                    <Header />
                </AntHeader>
                <Content style={{ margin: '16px' }}>
                    <AppRoute />
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
