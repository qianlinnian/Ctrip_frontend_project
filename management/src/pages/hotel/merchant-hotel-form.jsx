import react, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CtripHeader from '../../components/ctripheader';
import CtripSider from '../../components/ctripsider';
import { Avatar, Layout, Form, Button, Input, Rate, Upload, Select } from 'antd'
import apiService from '../../services/api';



const { Header, Content, Sider } = Layout;
const {TextArea} = Input;

//onSubmit : 父组件传递的的回调函数
const MerchantHotelForm = ({form}) => {

    const [tagOptions, setTagOptions] = useState([]);
    
    const fetchTagOptions = async () => {
        const response = await apiService.get('/hotel/tags');
        const data = await response.options;
        console.log('tags', data)
        setTagOptions(data);
    };

    useEffect(() => {
        fetchTagOptions();
    }, []);

    const cityList = [
        { value: '北京', label: '北京' },
        { value: '上海', label: '上海' },
        { value: '广州', label: '广州' },
        { value: '深圳', label: '深圳' },
        { value: '杭州', label: '杭州' },
        { value: '武汉', label: '武汉' },
        { value: '西安', label: '西安' },
        { value: '南京', label: '南京' },
        { value: '成都', label: '成都' },
        { value: '天津', label: '天津' },
        { value: '重庆', label: '重庆' },
        { value: '青岛', label: '青岛' },
        { value: '大连', label: '大连' },
        { value: '厦门', label: '厦门' },
        { value: '长沙', label: '长沙' },
        { value: '济南', label: '济南' },
        { value: '郑州', label: '郑州' },
        { value: '合肥', label: '合肥' },
        { value: '福州', label: '福州' },
        { value: '台北', label: '台北' },
        { value: '香港', label: '香港' },
        { value: '澳门', label: '澳门' }
    ]


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
                        name="hotel_name"
                        rules={[{ required: true, message: '请输入酒店名称' }]}>
                        <Input placeholder="请输入酒店名称"/>
                    </Form.Item>

                    {/* <!-- 所属城市 --> */}
                    <Form.Item label='所属城市' 
                    name='city'
                    rules={[{required: true, message: '请输入所属城市'}]}>
                        <Select options={cityList} showSearch={{ optionFilterProp: 'label' }} placeholder="请选择所属城市"></Select>
                    </Form.Item>

                    {/* <!-- 详细地址 --> */}
                    <Form.Item
                        label="详细地址"
                        name="hotel_address"
                        rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                        <Input placeholder="请输入详细地址（街道、门牌号）" />
                    </Form.Item>

                    {/* <!-- 酒店星级 --> */}
                    <Form.Item name="hotel_level">
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
                        <TextArea placeholder="请输入酒店简介" rows={4} />
                    </Form.Item>

                    {/* <!-- 设施标签 --> */}
                    <Form.Item
                        label="设施标签"
                        name="tags"
                        rules={[{ required: true, message: '请输入设施标签' }]}
                    >
                        <Select placeholder="请选择设施标签" mode="multiple" options={tagOptions} />
                    </Form.Item>

                    {/* <!-- 酒店图片上传 --> */}
                    <Form.Item
                        label="酒店图片"
                        name="images"
                        rules={[{ required: false, message: '请上传酒店图片' }]}
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
                    {/* <Form.Item
                        label="营业执照"
                        name="license"
                        rules={[{ required: false, message: '请上传营业执照' }]}
                    >
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            maxCount={5}
                        >
                            <p>点击上传营业执照扫描件</p>
                        </Upload>
                    </Form.Item> */}
                </Form>

            </div>
        </>
    )
};

export default MerchantHotelForm;
