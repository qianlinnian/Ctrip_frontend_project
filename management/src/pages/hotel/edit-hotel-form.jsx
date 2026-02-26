import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Tabs, Descriptions, Select } from 'antd';
import CtripHeader from '../../components/ctripheader'
import CtripSider from '../../components/ctripsider'
import RoomManage from './room-manage'
import apiService from '../../services/api';
import '../../styles/hotel-form.css'

const EditHotelForm = () => {
    const [hotelForm, setHotelForm] = useState({})
    const [tagOptions, setTagOptions] = useState([])
    const roomFormsRef = useRef({})
    const [activeKey, setActiveKey] = useState('1')
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const hotel_id = params.hotel_id
                const [hotelRes, hotelTagsRes, allTagsRes] = await Promise.all([
                    apiService.get(`/hotel/hotel-info/${hotel_id}`),
                    apiService.get(`/hotel/tags/${hotel_id}`),
                    apiService.get(`/hotel/tags`)
                ])
                const currentTagIds = hotelTagsRes.options.map(opt => opt.value)
                setHotelForm({ ...hotelRes.hotel, tags: currentTagIds })
                setTagOptions(allTagsRes.options)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchAllData()
    }, [])

    const tabsItems = useMemo(() => [
        { key: '1', label: '酒店信息', children: <Hotel hotelForm={hotelForm} setHotelForm={setHotelForm} tagOptions={tagOptions} /> },
        { key: '2', label: '房间信息', children: <RoomManage roomFormsRef={roomFormsRef} hotel_id={hotelForm.hotel_id} /> },
    ], [hotelForm, tagOptions])

    function removeUndefined(data) {
        if (data) {
            return Object.keys(data).reduce((result, key) => {
                result[key] = data[key] === undefined ? null : data[key]
                return result
            }, {})
        }
    }

    async function handleSubmit() {
        const hotelData = hotelForm;
        const roomsData = Object.values(roomFormsRef.current).map(form => form.getFieldsValue())
        const cleanRoomsData = roomsData.map(roomData => removeUndefined(roomData))
        const data = removeUndefined({ ...hotelData, rooms: cleanRoomsData })
        await apiService.post('/hotel/edit', data)
        navigate('/merchant/dashboard')
    }

    return (
        <div className="admin-layout">
            <CtripSider />
            <main className="admin-main">
                <CtripHeader />
                <div className="admin-content">
                    <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} items={tabsItems} />
                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button style={{ width: '120px', background: '#F5F5F5' }} onClick={handleSubmit}>提交</Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

const Hotel = ({ hotelForm, setHotelForm, tagOptions }) => {
    const [reviewMode, setReviewMode] = useState(true)

    const tagNames = tagOptions
        .filter(opt => hotelForm.tags?.includes(opt.value))
        .map(opt => opt.label)
        .join('、')

    return (
        <div>
            <div className="viewContainer">
                <Button onClick={() => setReviewMode(!reviewMode)}>
                    {reviewMode ? '编辑酒店信息' : '保存并返回'}
                </Button>
                <Descriptions className="viewContainer" bordered>
                    <Descriptions.Item label="酒店名称">{reviewMode ? hotelForm.hotel_name : <Input value={hotelForm.hotel_name} onChange={(e) => setHotelForm({ ...hotelForm, hotel_name: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="所属城市">{reviewMode ? hotelForm.city : <Input value={hotelForm.city} onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="详细地址">{reviewMode ? hotelForm.hotel_address : <Input value={hotelForm.hotel_address} onChange={(e) => setHotelForm({ ...hotelForm, hotel_address: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{reviewMode ? hotelForm.phone : <Input value={hotelForm.phone} onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="酒店等级" span={2}>{reviewMode ? hotelForm.hotel_level : <Input value={hotelForm.hotel_level} onChange={(e) => setHotelForm({ ...hotelForm, hotel_level: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="酒店简介" span={3}>{reviewMode ? hotelForm.description : <Input value={hotelForm.description} onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })} />}</Descriptions.Item>
                    <Descriptions.Item label="酒店标签" span={3}>
                        {reviewMode
                            ? (tagNames || '暂无标签')
                            : <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                options={tagOptions}
                                value={hotelForm.tags}
                                onChange={(values) => setHotelForm({ ...hotelForm, tags: values })}
                            />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="酒店图片" span={3}>{reviewMode ? hotelForm.images : <Input value={hotelForm.images} onChange={(e) => setHotelForm({ ...hotelForm, images: e.target.value })} />}</Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
}

export default EditHotelForm