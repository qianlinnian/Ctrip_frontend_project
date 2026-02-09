import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const Dashboard = () => {



    const navigate = useNavigate();
    const [hotelList, setHotelList] = useState([]);


    //用于重定向未登入
    // if(!localStorage.getItem('token')) {
    //     console.log('未登入，token不存在')
    //     navigate('/login')
    // }

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const fetchHoltelList = async () => {
            try {
                const response = await fetch('https://m1.apifoxmock.com/m1/7818580-7566390-default/hotel/info');
                if(!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                const hotels = data.hotel;
       
                console.log(hotels)
                setHotelList(hotels);
                console.log("酒店列表获取完成", hotels)
            }
            catch (error) {
                console.error('Error fetching hotel list:', error);
            }
        }

    // //获取商店列表 
    // useEffect(() => { 
    //     fetchHoltelList();
    // }, [])



    function getUserInfo() {
        console.log("获取用户信息")
        setUsername(localStorage.getItem('username'))
        setName(localStorage.getItem('name'))
        setEmail(localStorage.getItem('email'))
        setPhone(localStorage.getItem('phone'))
        console.log('用户名:', username, '姓名:', name, '邮箱:', email, '电话:', phone)
        console.log('用户信息获取完成')
    }

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
                        <button onClick={fetchHoltelList}>获取酒店列表</button>
                        <div class="user-avatar">商户头像</div>
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
                                {hotelList.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.city}</td>
                                        <td>{item.address}</td>
                                        <td>{item.level}</td>
                                        <td>{item.roomCount}</td>
                                        <td>{item.lowestPrice}</td>
                                        <td>{item.auditStatus}</td>
                                        <td>{item.publishStatus}</td>
                                        <td>{item.submitTime}</td>
                                    </tr>
                                ))}
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
