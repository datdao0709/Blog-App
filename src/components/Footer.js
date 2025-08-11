import React from 'react';
import {Layout} from 'antd';
import {
    FacebookOutlined,
    GithubOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import '../assets/style/global.css';

const {Footer} = Layout;

export default function AppFooter() {
    return (
        <Footer role="contentinfo" className="app-footer">
            <div className="social-links">
                <a
                    href="https://www.facebook.com/datdao2003/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: '#1877F2'}}
                >
                    <FacebookOutlined/>
                </a>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: '#181717'}}
                >
                    <GithubOutlined/>
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: '#0A66C2'}}
                >
                    <LinkedinOutlined/>
                </a>
                <a
                    href="https://www.instagram.com/datdao_0709/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: '#E4405F'}}
                >
                    <InstagramOutlined/>
                </a>
            </div>

            <div className="contact-info">
                <div><MailOutlined/> Email: daodat100277@gmail.com</div>
                <div><PhoneOutlined/> Điện thoại: 0328491281</div>
            </div>

            Blog Cá Nhân ©{new Date().getFullYear()} | Created by Đạt Đào
        </Footer>
    );
}
