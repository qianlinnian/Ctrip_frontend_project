import {React, useState} from 'react';
import { Form, Input, Button, Upload, message, Layout, Steps } from 'antd';
import CtripHeader from '../../components/ctripheader'
import CtripSider from '../../components/ctripsider'
import MerchantHotelForm from './merchant-hotel-form'
import RoomManage from './room-manage'


const { Header, Content, Sider } = Layout;



const HotelManage = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const stepContent = [
        <MerchantHotelForm />,
        <RoomManage />,
        <div>提交完成</div>
    ];

    const stepItems = [
        {
            key: '1',
            title: '填写酒店基本信息',
        },
        {
            key: '2',
            title: '填写房间信息',
        },
        {
            key: '3',
            title: '完成',
        },
    ];

    
    // 页面切换
    function handleNextStep() {
        if (currentStep < stepContent.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    function handlePrevStep() {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    //提交
    function handleSubmit() {
        console.log('提交');
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
                    {stepContent[currentStep]}
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
