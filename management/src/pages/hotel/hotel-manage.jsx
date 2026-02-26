import {react, useState, useRef, useMemo} from 'react';
import { Form, Input, Button, Upload, message, Layout, Steps } from 'antd';
import CtripHeader from '../../components/ctripheader'
import CtripSider from '../../components/ctripsider'
import MerchantHotelForm from './merchant-hotel-form'
import RoomManage from './room-manage'
import apiService from '../../services/api';



const { Header, Content, Sider } = Layout;



const HotelManage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [hotelForm] = Form.useForm()
    const roomFormsRef = useRef({})


    const stepItems = [
        {
            key: '1',
            title: '填写酒店基本信息',
        },
        {
            key: '2',
            title: '完成',
        },
    ];

    
    // 页面切换
    async function handleNextStep() {
        if(currentStep >= 1){
            return
        }
        const isValid = await validateCurrentStep();
        if(isValid) {
            setCurrentStep(currentStep + 1);
        }
        else {
            console.log("字段验证未通过")
        }
    }

    function handlePrevStep() {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }


    const validateCurrentStep = async () => {
        if (currentStep === 0) {
            try {
                await hotelForm.validateFields()
                return true
            } catch (error) {
                console.log("字段验证失败：", error)
                return false
            }
        }
    }



    //没有提交的数据不能为undefined,数据库会报错，必须修改为Null
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
        if(await validateCurrentStep()) {
        const hotelData = hotelForm.getFieldsValue();
        const merchantId = localStorage.getItem('id')

        const data = removeUndefined({...hotelData, merchant_id: merchantId})
        console.log("待提交的数据：", data)
        const response =  await apiService.post('/hotel/new', data)
        console.log("提交结果：", response)
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
                    <Steps current={currentStep} items={stepItems} />
                    {/* 步骤内容 */}
                    <div style={{ marginTop: '32px' }}>
                        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                            <Form form={hotelForm}>
                                <MerchantHotelForm form={hotelForm}/>
                            </Form>
                        </div>
                        
                        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <h2>✅ 提交完成</h2>
                            </div>
                        </div>
                    </div>


                    {/* <!-- 提交按钮 --> */}
                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Button type="button" className="btn btn-outline" style={{ width: '120px' }} onClick={handlePrevStep}>
                                上一步
                            </Button>
                            <Button type="button" className="btn btn-primary" style={{ width: '120px' }} onClick={handleNextStep} >
                                下一步
                            </Button>
                            <Button type="button" className="btn" style={{ width: '120px', background: '#F5F5F5' }} onClick={handleSubmit} >
                                提交
                            </Button>
                        </div>
                    </div>
                </div>  
            </main>
        </div>
    
);
}

export default HotelManage
