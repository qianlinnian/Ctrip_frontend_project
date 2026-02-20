import {react, useState, useEffect, useRef} from 'react'
import CtripSider from '../../components/ctripsider'
import CtripHeader from '../../components/ctripheader'
import RoomDetails from './room-details.jsx'

import { Dropdown, Tabs, Steps, Card } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { Input, Upload } from 'antd'
import { Button } from 'antd'
    



const roomManage = ({roomFormsRef}) => {
    const [roomForms, setRoomForms] = useState([])
    const [roomCount, setRoomCount] = useState(0)
 
    const formInstancesRef = useRef({})
    
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


    function handleAddRoom() {
        
        setRoomForms([...roomForms, {
            id: Date.now(),
            index: roomCount+1,
            name: `房间类型${roomCount+1}`
        }])
        setRoomCount(roomCount + 1)
    }

    function handleRemoveRoom(index) {
        setRoomForms(roomForms.filter(item => item.id !== index))
        delete formInstancesRef.current[index]
        setRoomCount(roomCount - 1)
    }



    // function getAllRoomData() {
    //     try{
    //         const allRoomData = roomForms.map(item => {
    //             const roomForm = formInstancesRef.current[item.id]
    //             if(roomForm)
    //             {
    //                 return roomForm.getFieldsValue() 
    //             }
                   
    //         })
    //         return allRoomData
    //     }
    //     catch(e) {
    //         console.log(e.message)
    //     }
    // }


    const checkAllForm = () => {
        console.log("所有房间表单:",getAllRoomData(),"roomForms:", roomForms)
    }
    //
    const tabsItems = roomForms.map((roomItem) => ({
        key: roomItem.id.toString(),
        label: roomItem.name,
        type: "editable-card",
        onClose: () => handleRemoveRoom(roomItem.id),
        children: (
            <Card>
                <RoomFormContent roomId={roomItem.id} formInstancesRef={roomFormsRef} />
                <Button onClick={() => handleRemoveRoom(roomItem.id)}>删除房间</Button>
            </Card>
        )
    }))

    return (
        <main className="admin-main-content">
             <Button type="dashed" onClick={handleAddRoom}>添加房间</Button>
             <Button onClick={checkAllForm}>查看当前表单信息</Button>
            <div className="room-type">
                <Tabs defaultActiveKey="1"
                style={{height: 'auto'}}
                items={tabsItems}/>
                
            </div>
           
            
        </main>
    )

}




const RoomFormContent = ({roomId, formInstancesRef}) => {
    const [form] = Form.useForm()
    
    useEffect(()=> {
        formInstancesRef.current[roomId] = form

        return () => {
            delete formInstancesRef.current[roomId]
        }
    }, [form, roomId, formInstancesRef])

    return (
        <Form form={form}>
                    <div className="room-details">
                    <Form.Item label="房间名称" name="room_name" rules={[{ required: true, message: '请输入房间名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间价格" name="room_price" rules={[{ required: true, message: '请输入房间价格' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间数量" name="room_count" rules={[{ required: true, message: '请输入房间数量' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间类型" name="room_type" rules={[{ required: true, message: '请输入房间类型' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间描述" name="room_description" rules={[{ required: true, message: '请输入房间描述' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间图片" name="room_images" rules={[{ required: false, message: '请上传房间图片' }]}>
                        <Upload listType='picture-card'>
                            上传图片
                        </Upload>
                    </Form.Item>
                    </div>
                </Form>
    )
}

export default roomManage
