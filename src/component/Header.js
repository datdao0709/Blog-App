import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Header = () => {
    return (
        <div style={{ padding: '0 16px' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                Blog App
            </Title>
        </div>
    );
};

export default Header;
