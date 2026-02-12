import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Input, Button, Space, Avatar, Select, Badge, Dropdown } from 'antd';

import { BellOutlined } from '@ant-design/icons';


const { Sider , Header} = Layout;


function fetchAvatar() {
    console.log('fetching avatar...')
    apiService.fetchUserInfo().then(data => {
    setUserInfo(data);
    
    });
    
}

function handleMenuClick(item) {
    console.log('click', item.key );
    switch(item.key) {
        case 'logout':
            message.info('退出登入');
            break;
    }
}

function handeLogout() {
    localStorage.clear()
    window.location.href = '/login';
}

function handleNotificationClick(item) {
    console.log('click notification');
    switch(item.key) {
        case '1':
            console.log('click my notification');
            break;
    }
}

const CtripHeader = () => {
    const [title, setTitle] = useState('');
    const [userInfo, setUserInfo] = useState({
        username: localStorage.getItem('username') || '商户昵称',
        name: localStorage.getItem('name') || '商户姓名',
    });

    const userMenuItem = [
        { key: 'logout', label: '退出登入' }
    ];

    const notificationMenu = [
        {key: '1', label:'我的消息'}
    ]


    return (
    <Header class="admin-header">
    <div class="header-left">
        <h2 class="page-title">我的酒店</h2>
    </div>
    <div class="header-right">
        {/* 通知图标 */}
        <Dropdown
            menu={{items: notificationMenu,onClick:handleNotificationClick}}
            placement="bottomRight"
            trigger={['hover']}
       
        >
            <Badge count={3} size="small">
                <BellOutlined style={{ fontSize: '16px' }}/>
            </Badge>
        </Dropdown>
        {/* 下拉菜单 */}
        <Dropdown
            menu={{items: userMenuItem, onClick: handleMenuClick}}
            placement="bottomRight"
            trigger={['hover']}
        >
            <div className="header-user" style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                <Avatar class="user-avatar">头像</Avatar> 
                <span className="user-name" style={{ marginLeft: '8px' }}>
                    {userInfo.name}|{userInfo.username}
                </span>
            </div>
        </Dropdown>
    </div>
    </Header>
)}
export default CtripHeader;
