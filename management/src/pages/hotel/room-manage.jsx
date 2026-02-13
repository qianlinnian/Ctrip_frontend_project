import {react, useState, useEffect} from 'react'
import CtripSider from '../../components/ctripsider'
import CtripHeader from '../../components/ctripheader'
import RoomDetails from './room-details.jsx'

import { Dropdown, Tabs, Steps } from 'antd'
import { DownOutlined } from '@ant-design/icons'


function handleChangeRoomType(e) {
    switch(e.key) {
        case '1':
            console.log('标准单人间');
            break;
        case '2':
            console.log('标准双人间');
            break;
        case '3':
            console.log('标准套房');
            break;
        case '4':
            console.log('新增房间类型');
            break;
    }
}


const roomManage = () => {

    const [roomItems, setRoomItems] = useState([
        {
            key:'1',
            label: '标准单人间',
            children: <RoomDetails />
        },
        {
            key:'2',
            label: '标准双人间',
            children: <RoomDetails />
        },
        {
            key:'3',
            label: '标准套房',
            children: <RoomDetails />
        },
        {
            key:'4',
            label: '新增房间类型',
            children: <RoomDetails />
        }
    ])







    return (
        <main className="admin-main-content">
            <div className="room-type">
                <Tabs defaultActiveKey="1"
                style={{height: 200}}
                items={roomItems}>
                </Tabs>
            </div>
        </main>

    )
}

export default roomManage
