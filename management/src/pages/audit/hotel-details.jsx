import {react, useState, useEffect} from 'react'
import {Descriptions, Table, Tabs} from 'antd'


import apiService from '../../services/api'

const hotelDetails = ({hotel_id}) => {
    const [datasource, setDatasource] = useState([])
    const [roomData, setRoomData] = useState([])
    const [tagOptions, setTagOptions] = useState([])

    const fetchTagOptions = async () => {
        try {
            const response = await apiService.get(`/hotel/tags/${hotel_id}`)
            const tags = response.options

            setTagOptions(tags.map(tag => tag.label + '/ '))
        } catch (error) {
            console.error('Error fetching tag options:', error)
        }
    }

    const fetchHotelData = async () => {
        try {
            const response = await apiService.get(`/hotel/hotel-info/${hotel_id}`)
            
            setDatasource(response.hotel)
            
            const roomResponse = await apiService.get(`/hotel/room-info/${hotel_id}`)
            setRoomData(roomResponse.room)
        } catch (error) {
            console.error('Error fetching hotel data:', error)
        }
    }

    useEffect(() => {
        fetchHotelData()
        fetchTagOptions()
    }, [hotel_id])

    const hotelDescriptionItems = [
        {
            key:'1',
            label:'酒店名称',
            children: datasource.hotel_name
        },
        {
            key:'2',
            label:'城市',
            children: datasource.city
        },

        {
            key:'3',
            label:'酒店详细地址',
            children: datasource.hotel_address
        },
        {
            key:'4',
            label:'酒店联系方式',
            children: datasource.phone
        },
        {
            key:'5',
            label:'起始价格',
            span: 'filled',
            children: datasource.price_start
        },
        {
            key:'6',
            label:'酒店等级',
            children: datasource.hotel_level
        },
        {
            key:'7',
            label:'酒店标签',
            span: 'filled',
            children: tagOptions
        },
        {
            key:'8',
            label:'酒店简介',
            span: 'filled',
            children: datasource.description
        },
        {
            key:'9',
            label:'酒店图片',
            span: 'filled',
            children: datasource.images
        },
    ]

    const roomTableItems = [
        {
            title:'房间ID',
            dataIndex: 'room_id'
        },
        {
            title:'房间类型ID',
            dataIndex: 'room_type_id'
        },
        {
            title:'房间价格',
            dataIndex: 'price'
        },
        {
            title:'房间数量',
            dataIndex: 'room_count'
        },
        // {
        //     title:'房间图片',
        //     dataIndex: 'images'
        // },
    ]

    const tabsItems = [
        {
            key: '1',
            label: '酒店信息',
            children: <Descriptions layout='vertical' bordered items={hotelDescriptionItems} />
        },
        {
            key: '2',
            label:'房间信息',
            children: <Table layout='vertical' bordered columns={roomTableItems} dataSource={roomData} />
        }
    ]

    

    return (
        <>
            <Tabs items={tabsItems}>
                <Descriptions layout='vertical' bordered items={hotelDescriptionItems} />
            </Tabs>
            
        </>
    )
}

export default hotelDetails
