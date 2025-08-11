import React, {useState} from 'react';
import {Layout, Menu, Card, Button, Drawer, Grid} from 'antd';
import {HomeOutlined, PlusOutlined, LogoutOutlined, MenuOutlined, UserOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import AppFooter from '../components/Footer';
import AppRoute from '../route/AppRoute';
import "../assets/style/global.css"

const {Header: AntHeader, Content, Sider} = Layout;
const {useBreakpoint} = Grid;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, logout} = useAuth();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();

    const menuItems = [
        {key: '/', icon: <HomeOutlined/>, label: 'Trang chủ'},
        ...(user ? [
            {key: '/profile', icon: <UserOutlined/>, label: 'Hồ sơ'},
            {key: '/create', icon: <PlusOutlined/>, label: 'Thêm bài viết'},
        ] : []),
        ...(user ? [
            {key: 'logout', icon: <LogoutOutlined/>, label: 'Đăng xuất'}
        ] : []),
    ];


    const handleMenuClick = ({key}) => {
        if (key === 'logout') {
            if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
                logout();
                navigate('/login');
            }
        } else {
            navigate(key);
        }
        setDrawerVisible(false);
    };

    const showDrawer = () => setDrawerVisible(true);
    const onClose = () => setDrawerVisible(false);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider breakpoint="lg" collapsedWidth="0" style={{display: screens.lg ? 'block' : 'none'}}>
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems}
                      onClick={handleMenuClick}/>
            </Sider>
            <Layout>
                <AntHeader className="main-header">
                    <Header/>
                    {!screens.lg && (
                        <Button
                            icon={<MenuOutlined/>}
                            type="text"
                            onClick={showDrawer}
                            aria-label="Open menu"
                            className="menu-toggle-btn"
                        />
                    )}
                </AntHeader>
                <Content className="main-content">
                    <Card bordered={false} className="main-card">
                        <AppRoute/>
                    </Card>
                </Content>
                <AppFooter/>
            </Layout>
            <Drawer title="Menu" placement="left" onClose={onClose} open={drawerVisible}>
                <Menu mode="vertical" items={menuItems} onClick={handleMenuClick} selectedKeys={[location.pathname]}/>
            </Drawer>
        </Layout>
    );
}