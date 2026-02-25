import {react, useState} from 'react'
import {Descriptions, Table, Tabs} from 'antd'



const hotelDetails = () => {

    const datasource = {
        name: '酒店名称',
        address: '酒店地址',
        star: '酒店等级',
        description: '酒店简介',
        images: '酒店图片',
        liscense: '营业执照'
    }

    const hotelDescriptionItems = [
        {
            key:'1',
            label:'酒店名称',
            children: datasource.name
        },
        {
            key:'2',
            label:'酒店地址',
            children: datasource.address
        },
        {
            key:'3',
            label:'酒店等级',
            children: datasource.star
        },
        {
            key:'4',
            label:'酒店简介',
            span: 'filled',
            children: datasource.description
        },
        {
            key:'5',
            label:'营业执照',
            span: 'filled',
            children: datasource.liscense
        },
        {
            key:'6',
            label:'酒店图片',
            span: 'filled',
            children: datasource.images
        },
    ]

    const roomTableItems = [
        {
            title:'房间名称',
            dataIndex: 'name'
        },
        {
            title:'房间价格',
            dataIndex: 'price'
        },
        {
            title:'房间数量',
            dataIndex: 'roomCount'
        },
        {
            title:'房间图片',
            dataIndex: 'images'
        },
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
            children: <Table layout='vertical' bordered columns={roomTableItems} />
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
