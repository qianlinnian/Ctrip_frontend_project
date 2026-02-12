import {react} from 'react';
import { Layout, Menu, Breadcrumb, Input, Button, Space } from 'antd';

const { Sider } = Layout;


const CtripSider = (item) => (
    <Sider>
        <div class="sidebar-header">
            <h1 class="sidebar-logo">易宿酒店</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{item.role}</p>
        </div>
        <nav class="sidebar-menu">
                    <div class="menu-item active">                    <span class="menu-icon">🏨</span>
                <span>{item.title}</span> 
            </div>
        </nav>
    </Sider>
)

export default CtripSider;
