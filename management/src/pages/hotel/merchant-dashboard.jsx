import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Avatar, Button, Table, Input, Space} from 'antd';
import CtripSider from '../../components/ctripsider.jsx';
import CtripHeader from '../../components/ctripheader.jsx';



/*table item
title: 表头显示的文本
dataIndex: 指定从数据中的对应字段获取数据
key:列多的唯一标识
render:自定义渲染函数
*/
const columns = [
    {
        title: '酒店名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '城市',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '星级',
        dataIndex: 'star',
        key: 'star',
    },
    {
        title: '房间数',
        dataIndex: 'roomCount',
        key: 'roomCount',
    },
    {
        title: '起始价',
        dataIndex: 'lowestPrice',
        key: 'lowestPrice',
    },
    {
        title: '审核状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
    },
    {
        title: '发布状态',
        dataIndex: 'publishStatus',
        key: 'publishStatus',
    },
    {
        title: '提交时间',
        dataIndex: 'submitTime',
        key: 'submitTime',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        //（_表示当前行对应字段的值，这里字段action不存在，所以不使用，record表示当前行数据）
        render: (_, record) => (
            <Space size="small">
                <Button type="primary" onClick={() => handleEditHotel(record.id)}>编辑</Button>
            </Space>
        ),
    },
];





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

                //promise对象只能.json一次
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

    function handleNewHotel() {
        console.log("跳转到新增酒店页面")
        navigate('/merchant-dashboard/new')
    }

    function handleEditHotel(id) {
        console.log("跳转到编辑酒店页面")
        navigate(`/merchant-dashboard/edit/${id}`);
    }


    return (
        <>
            <div class="admin-layout">

                {/* <!-- 侧边栏 --> */}
                <CtripSider />

                {/* <!-- 主内容区 --> */}
                <main class="admin-main">

                    {/* <!-- 顶部栏 --> */}
                    <CtripHeader />
                    <Button type="primary" onClick={fetchHoltelList}>获取酒店列表</Button>

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
                            <button class="btn btn-primary btn-sm" onClick={handleNewHotel}>
                            ➕ 新增酒店
                            </button>
                        </div>
                        </div>

                        {/* <!-- 数据表格 --> */}
                        <Table columns={columns} dataSource={hotelList} />
                    </div>
                </main>

            </div>
        </>
    )
}


export default Dashboard;
