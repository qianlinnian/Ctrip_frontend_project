import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const Dashboard = () => {

    const navigate = useNavigate();

    
    function handleAddHotel() {
        console.log("跳转到新增酒店页面")
        navigate('/merchant-hotel-form')
    }


    return (
        <>
            <div class="admin-layout">

                {/* <!-- 侧边栏 --> */}
                <aside class="admin-sidebar">
                <div class="sidebar-header">
                    <h1 class="sidebar-logo">易宿酒店</h1>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>商户端</p>
                </div>
                <nav class="sidebar-menu">
                    <div class="menu-item active">
                    <span class="menu-icon">🏨</span>
                    <span>我的酒店</span> 
                    </div>
                </nav>
                </aside>

                {/* <!-- 主内容区 --> */}
                <main class="admin-main">

                {/* <!-- 顶部栏 --> */}
                <header class="admin-header">
                    <div class="header-left">
                    <h2 class="page-title">我的酒店</h2>
                    </div>
                    <div class="header-right">
                    <div class="header-user" onclick="showUserMenu()">
                        <div class="user-avatar">商</div>
                        <span class="user-name">商户账号</span>
                        <span>▼</span>
                    </div>
                    </div>
                </header>

                {/* <!-- 内容区 --> */}
                <div class="admin-content">

                    {/* <!-- 操作栏 --> */}
                    <div class="content-toolbar">
                    <div class="toolbar-left">
                        <div class="search-box">
                        <span>🔍</span>
                        <input type="text" placeholder="搜索酒店名称..." />
                        </div>
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-primary btn-sm" onClick={handleAddHotel}>
                        ➕ 新增酒店
                        </button>
                    </div>
                    </div>

                    {/* <!-- 数据表格 --> */}
                    <div class="data-table">
                    <table>
                        <thead>
                        <tr>
                            <th>酒店名称</th>
                            <th>城市</th>
                            <th>地址</th>
                            <th>星级</th>
                            <th>房间数</th>
                            <th>起始价</th>
                            <th>审核状态</th>
                            <th>发布状态</th>
                            <th>提交时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>如家精选酒店(上海外滩店)</td>
                            <td>上海</td>
                            <td>黄浦区南京东路123号</td>
                            <td>⭐⭐⭐⭐</td>
                            <td>128</td>
                            <td>¥288</td>
                            <td><span class="status-badge status-approved">审核通过</span></td>
                            <td><span class="status-badge status-approved">已发布</span></td>
                            <td>2024-01-15</td>
                            <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="editHotel(1)">编辑</button>
                                <button class="action-btn" onclick="viewDetail(1)">查看</button>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>汉庭酒店(上海人民广场店)</td>
                            <td>上海</td>
                            <td>黄浦区福州路88号</td>
                            <td>⭐⭐⭐</td>
                            <td>96</td>
                            <td>¥198</td>
                            <td><span class="status-badge status-pending">审核中</span></td>
                            <td><span class="status-badge" style={{ background: '#F0F0F0', color: '#999' }}>未发布</span></td>
                            <td>2024-02-06</td>
                            <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="editHotel(2)">编辑</button>
                                <button class="action-btn" onclick="viewDetail(2)">查看</button>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>锦江之星酒店(南京路店)</td>
                            <td>上海</td>
                            <td>黄浦区南京西路456号</td>
                            <td>⭐⭐⭐⭐</td>
                            <td>108</td>
                            <td>¥258</td>
                            <td><span class="status-badge status-rejected">审核未通过</span></td>
                            <td><span class="status-badge" style={{ background: '#F0F0F0', color: '#999' }}>未发布</span></td>
                            <td>2024-02-05</td>
                            <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="editHotel(3)">修改</button>
                                <button class="action-btn" onclick="viewReason(3)">原因</button>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>全季酒店(虹桥店)</td>
                            <td>上海</td>
                            <td>闵行区虹桥路888号</td>
                            <td>⭐⭐⭐⭐</td>
                            <td>156</td>
                            <td>¥338</td>
                            <td><span class="status-badge" style={{ background: '#F0F0F0', color: '#999' }}>草稿</span></td>
                            <td><span class="status-badge" style={{ background: '#F0F0F0', color: '#999' }}>未发布</span></td>
                            <td>2024-02-07</td>
                            <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="editHotel(4)">继续编辑</button>
                                <button class="action-btn delete" onclick="deleteHotel(4)">删除</button>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {/* <!-- 分页 --> */}
                    <div class="pagination">
                        <button class="page-btn">‹</button>
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">›</button>
                    </div>
                    </div>

                </div>

                </main>

            </div>
        </>
    )
}


export default Dashboard;
