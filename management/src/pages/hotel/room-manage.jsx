import {react, useState, useEffect, useRef} from 'react'
import CtripSider from '../../components/ctripsider'
import CtripHeader from '../../components/ctripheader'

import { Dropdown, Tabs, Steps, Card } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { Input, Upload } from 'antd'
import { Button } from 'antd'
    




//initialRooms:传入房间初始化列表
const roomManage = ({roomFormsRef, initialRooms}) => {
    const [roomForms, setRoomForms] = useState([])
    const [roomCount, setRoomCount] = useState(0)

    


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
        delete roomFormsRef.current[index]
        setRoomCount(roomCount - 1)
    }



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
                <RoomFormContent roomId={roomItem.id} roomFormsRef={roomFormsRef} />
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




const RoomFormContent = ({roomId, roomFormsRef}) => {
    const [form] = Form.useForm()
    
    useEffect(()=> {
        roomFormsRef.current[roomId] = form

        return () => {
            delete roomFormsRef.current[roomId]
        }
    }, [form, roomId, roomFormsRef])

    return (
        <Form form={form}>
                    <div className="room-details">
                    <Form.Item label="酒店ID" name="hotel_id"><Input /></Form.Item>
                   

                    <Form.Item label="房间名称" name="room_name" rules={[{ required: true, message: '请输入房间名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间价格" name="price" rules={[{ required: true, message: '请输入房间价格' }]}>
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
