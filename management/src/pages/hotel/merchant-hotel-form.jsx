import react, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CtripHeader from '../../components/ctripheader';
import CtripSider from '../../components/ctripsider';
import { Avatar, Layout, Form, Button, Input, Rate, Upload } from 'antd'



const { Header, Content, Sider } = Layout;


//onSubmit : 父组件传递的的回调函数
const MerchantHotelForm = ({form}) => {


    const [cityList, setCityList] = useState([
        '北京', '上海', '广州', '深圳', '杭州', '武汉', '西安', '南京', '成都', '天津',
        '重庆', '青岛', '大连', '厦门', '长沙', '济南', '郑州', '合肥', '福州', '台北'
    ]);

    const {id} = useParams();
    console.log('id:', id)

    useEffect(() => {
        if (id) {
            loadHotelData(id);// Fetch hotel data by id and set it to formData
        }
    }, [id]);

    const loadHotelData = async (id) => {
        try {
            const response = await fetch(`https://m1.apifoxmock.com/m1/7818580-7566390-default/hotel/idtoinfo/${id}`);

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();         
            setFormData(data);
            console.log('formData', formData)
        } catch (error) {
            console.error('Error fetching hotel data:', error);
        }
    };

    // function handleSubmit() {
    //     if(onSubmit) {
    //         onSubmit(formData);
    //     }
    // }

    return (
        <>
            {/* <!-- 表单卡片 --> */}
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>

                <h3 style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--text-primary)' }}>
                    基本信息
                </h3>
                <Form id="hotelForm" form={form}>

                    {/* <!-- 酒店名称 --> */}
                    <Form.Item
                        label="酒店名称"
                        name="name"
                        rules={[{ required: true, message: '请输入酒店名称' }]}>
                        <Input placeholder="请输入酒店名称"/>
                    </Form.Item>

            

                    {/* <!-- 所属城市 --> */}
                    <Form.Item label='所属城市'>
                        <Input placeholder="请输入所属城市"  />
                    </Form.Item>

                    {/* <!-- 详细地址 --> */}
                    <Form.Item
                        label="详细地址"
                        name="address"
                        rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                        <Input placeholder="请输入详细地址（街道、门牌号）" />
                    </Form.Item>

                    {/* <!-- 酒店星级 --> */}
                    <Form.Item>
                        <Rate />
                        
                    </Form.Item>
                    {/* <!-- 联系电话 --> */}
                    <Form.Item
                        label="联系电话"
                        name="phone"
                        rules={[{ required: true, message: '请输入联系电话' }]}
                    >
                        <Input placeholder="请输入酒店联系电话" />
                    </Form.Item>

                    {/* <!-- 酒店简介 --> */}
                    <Form.Item
                        label="酒店简介"
                        name="description"
                        rules={[{ required: true, message: '请输入酒店简介' }]}
                    >
                        <Input placeholder="请输入酒店简介"  />
                    </Form.Item>

                    {/* <!-- 设施标签 --> */}
                    

                    {/* <!-- 酒店图片上传 --> */}
                    <Form.Item
                        label="酒店图片"
                        name="images"
                        rules={[{ required: true, message: '请上传酒店图片' }]}
                    >
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            maxCount={5}
                        >
                            <p>点击上传酒店图片</p>
                        </Upload>
                    </Form.Item>

                    {/* <!-- 营业执照上传 --> */}
                    <Form.Item
                        label="营业执照"
                        name="license"
                        rules={[{ required: true, message: '请上传营业执照' }]}
                    >
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            maxCount={5}
                        >
                            <p>点击上传营业执照扫描件</p>
                        </Upload>
                    </Form.Item>
                </Form>

            </div>
        </>
    )
};

export default MerchantHotelForm;
