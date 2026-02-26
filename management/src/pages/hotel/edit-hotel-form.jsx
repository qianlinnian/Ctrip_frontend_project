import {react, useState, useRef, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import { Form, Input, Button, Upload, message, Layout, Steps, Tabs, Descriptions, Select } from 'antd';
import CtripHeader from '../../components/ctripheader'
import CtripSider from '../../components/ctripsider'
import MerchantHotelForm from './merchant-hotel-form'
import RoomManage from './room-manage'
import apiService from '../../services/api';
import '../../styles/hotel-form.css'




const { Header, Content, Sider } = Layout;



const EditHotelForm = () => {
    const [hotelForm, setHotelForm] = useState({})
    const roomFormsRef = useRef({})
    const [activeKey, setActiveKey] = useState('1')
    const params = useParams()
    //编辑模式变量 0为静态查看，1为编辑模式




    const fetchHotelData = async () => {
        try {
            const hotel_id = params.hotel_id
            console.log("Fetching hotel data for hotel_id:", hotel_id)
            const response = await apiService.get(`/hotel/hotel-info/${hotel_id}`)
            console.log("fetchHotelData：", response.hotel)
            setHotelForm(response.hotel)
       
        } catch (error) {
            console.error("Error fetching hotel data:", error)
        }
    }

    useEffect(() => {
        fetchHotelData()
    }, [])

    const tabsItems = [
        { key: '1', label: '酒店信息', children: <Hotel hotelForm={hotelForm} setHotelForm={setHotelForm} />},
        { key: '2', label: '房间信息', children: <RoomManage roomFormsRef={roomFormsRef} hotel_id={hotelForm.hotel_id} />},
    ];


    function removeUndefined(data) {
        if(data) {
            return Object.keys(data).reduce((result, key) => {
                const value = data[key]
                if(value === undefined) {
                    result[key] = null
                }
                else{
                    result[key] = value
                }
                return result
            }, {})
        }
    }


    //提交
    async function handleSubmit() {
        //if(await validateCurrentStep()) 
        {
        const hotelData = hotelForm;
        console.log("hotelData in edit-hotel-form page", hotelData)
        const roomsData = Object.values(roomFormsRef.current).map(form => form.getFieldsValue())
        const cleanRoomsData = roomsData.map(roomData => removeUndefined(roomData))

        const data = removeUndefined({...hotelData, rooms: cleanRoomsData})
        console.log("data in edit-hotel-form page", data)
        const response = await apiService.post('/hotel/edit', data)
        /*语法解释
        Object.values():提取对象值,将对象转换为值数组
        roomFormsRef.current以键值对存储，键是id，值是form实例
        */
        // const roomsData = Object.values(roomFormsRef.current).map(form => form.getFieldsValue());
        // const cleanRoomsData = roomsData.map(roomData => removeUndefined(roomData))
        // const cleanHotelData = removeUndefined(hotelData)

        // const data = {...cleanHotelData, rooms: cleanRoomsData, merchant_id: 1, status: "pending"}
        
        // console.log("待提交的数据：", data)

        // const response =  await apiService.post('/hotel/new', data)


        // console.log("提交结果：", response)

        }
    }


    return (
        <div className="admin-layout">
            {/* <!-- 侧边栏 --> */}
            <CtripSider />
            {/* <!-- 主内容区 -->   */}
            <main className="admin-main">
                {/* <!-- 顶部栏 --> */}
                <CtripHeader />
                {/* <!-- 内容区 --> */}
                <div className="admin-content">
                    {/* 酒店信息详情页 */}
                    <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} items={tabsItems}>
                    </Tabs>
                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Button type="button" className="btn" style={{ width: '120px', background: '#F5F5F5' }} onClick={handleSubmit} >
                                提交
                            </Button>
                        </div>
                    </div>
                </div>  
            </main>
        </div>
    
)}



const Hotel = ({hotelForm, setHotelForm} ) => {
    const [reviewMode, setReviewMode] = useState(true)
    
    return (
        <div>
            <div className="viewContainer">
                <Button onClick={() => setReviewMode(!reviewMode)}>{reviewMode ? '编辑酒店信息' : '保存并返回'}</Button>
                <Descriptions className="viewContainer" bordered>
                    <Descriptions.Item label="酒店名称">{reviewMode ? (hotelForm.hotel_name) : (<Input value={hotelForm.hotel_name} onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})}/>)}</Descriptions.Item>    
                    <Descriptions.Item label="所属城市">{reviewMode ? (hotelForm.city) : (<Input value={hotelForm.city} onChange={(e) => setHotelForm({...hotelForm, city: e.target.value})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="详细地址">{reviewMode ? (hotelForm.hotel_address) : (<Input value={hotelForm.hotel_address} onChange={(e) => setHotelForm({...hotelForm, hotel_address: e.target.value})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{reviewMode ? (hotelForm.phone) : (<Input value={hotelForm.phone} onChange={(e) => setHotelForm({...hotelForm, phone: e.target.value})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="酒店等级" span='filled'>{reviewMode ? (hotelForm.hotel_level) : (<Input value={hotelForm.hotel_level} onChange={(e) => setHotelForm({...hotelForm, hotel_level: e.target.value})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="酒店简介" span='filled'>{reviewMode ? (hotelForm.description) : (<Input value={hotelForm.description} onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="酒店标签" span='filled'>{reviewMode ? (hotelForm.tags) : (<Select options={hotelForm.tags} onChange={(e) => setHotelForm({...hotelForm, tags: e})}/>)}</Descriptions.Item>
                    <Descriptions.Item label="酒店图片" span='filled'>{reviewMode ? (hotelForm.images) : (<Input value={hotelForm.images} onChange={(e) => setHotelForm({...hotelForm, images: e.target.value})}/>)}</Descriptions.Item>
                </Descriptions>     
            </div>
        </div>
    )
}

export default EditHotelForm
