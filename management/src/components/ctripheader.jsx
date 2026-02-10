import {react} from 'react';
import { Layout, Menu, Breadcrumb, Input, Button, Space } from 'antd';

const { Sider , Header} = Layout;

const CtripHeader = () => (
    <Header class="admin-header">
                        <div class="header-left">
                        <h2 class="page-title">我的酒店</h2>
                        </div>
                        <div class="header-right">
                        <div class="header-user" onclick="showUserMenu()">
                            <div class="user-avatar">商户头像</div>
                            <span class="user-name">商户账号</span>
                            <span>▼</span>
                        </div>
                        </div>
    </Header>
);
export default CtripHeader;
