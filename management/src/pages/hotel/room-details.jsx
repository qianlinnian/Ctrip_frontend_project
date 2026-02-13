import {React, useState} from 'react';
import { Form, Input, Button, Upload } from 'antd';



const RoomDetails = () => {
    
    return (
        <>
            <div className="room-details">
                <Form>
                    <Form.Item label="房间名称">
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间价格">
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间描述">
                        <Input />
                    </Form.Item>
                    <Form.Item label="房间图片">
                        <Upload listType='picture-card'>
                            上传图片
                        </Upload>
                    </Form.Item>
                </Form>
                <Button type="primary">提交</Button>
            </div>
        </>
    )

}

export default RoomDetails
