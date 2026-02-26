import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Avatar, Button, Table, Input, Space} from 'antd';
import CtripSider from '../../components/ctripsider.jsx';
import CtripHeader from '../../components/ctripheader.jsx';






const Dashboard = () => {

    const navigate = useNavigate();
    const [hotelList, setHotelList] = useState([]);

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    

    /*table item
    title: 表头显示的文本
    dataIndex: 指定从数据中的对应字段获取数据
    key:列多的唯一标识
    render:自定义渲染函数
    */
    const columns = [
        {
            title: '酒店名称',
            dataIndex: 'hotel_name',
            key: 'name',
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '地址',
            dataIndex: 'hotel_address',
            key: 'address',
        },
        {
            title: '星级',
            dataIndex: 'hotel_level',
            key: 'star',
        },
        {
            title: '房间数',
            dataIndex: 'room_count',
            key: 'roomCount',
        },
        {
            title: '起始价',
            dataIndex: 'price_start',
            key: 'lowestPrice',
        },
        {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'auditStatus',
        },
        {
            title: '发布状态',
            dataIndex: 'publish_status',
            key: 'publishStatus',
        },
        {
            title: '提交时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            //（_表示当前行对应字段的值，这里字段action不存在，所以不使用，record表示当前行数据）
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" onClick={() => handleEditHotel(record.hotel_id)}>编辑酒店信息</Button>
                </Space>
            ),
        },
    ];


    const fetchHotelList = async () => {
        const url = 'http://localhost:5000/api/hotel/my-hotels';
            try {
                const merchant_id = localStorage.getItem('id');
                const response = await fetch(url, 
                    {method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({merchant_id: merchant_id})
                });
                if(!response.ok) throw new Error('Network response was not ok');

                //promise对象只能.json一次
                const data = await response.json();
                const hotels = data.hotels;
       
                console.log("酒店列表:", hotels)
                setHotelList(hotels);
                console.log("酒店列表获取完成", hotels)
            }
            catch (error) {
                console.error('Error fetching hotel list:', error);
            }
        }

        useEffect (() => {
            fetchHotelList()
        }, [])


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
        navigate('/merchant/dashboard/new')
    }

    function handleEditHotel(hotel_id) {
        console.log("跳转到编辑酒店页面")
        navigate(`/merchant/dashboard/edit/${hotel_id}`);
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
                    <Button type="primary" onClick={fetchHotelList}>获取酒店列表</Button>

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
