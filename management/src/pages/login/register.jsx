import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/pc-common.css'
import apiService from '../../services/api.js'
import {Form, Input, Button, message} from 'antd';


const Register = () => {

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordIsShow, setPasswordIsShow] = useState(false);
    const navigate = useNavigate();

    const registerFormItem = [
        {label: '用户名', name: 'username', type: 'text', placeholder: '请输入用户名（4-16位字符）'},
        {label: '邮箱', name: 'email', type: 'text', placeholder: '请输入邮箱地址'},
        {label: '密码', name: 'password', type: 'password', placeholder: '请输入密码（6-20位）'},
        {label: '确认密码', name: 'confirmPassword', type: 'password', placeholder: '请再次输入密码'},
        {label: '手机号', name: 'phone', type: 'text', placeholder: '请输入手机号'}
    ]


    const handleRegister = async () => {

        console.log('Register:\n', 'username:', username, 'phone:', phone, 'email:', email, 'password:', password);
        if(password != confirmPassword) {
            console.log('passwords not match');
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username, name: name, phone: phone, email: email, password: password})
            })

            if(response.ok) {
                console.log('Register successful')
                navigate('/login')
            }
        } catch (error) {
            console.error('Register failed:', error.message);
        }
    }
    
    return(
        <div class="login-page">
            {/* <!-- 注册容器 --> */}
            <div class="login-container">

                {/* <!-- 左侧品牌区域 --> */}
                <div class="login-brand">
                <div class="brand-content">
                    <h1 class="brand-logo">易宿酒店</h1>
                    <p class="brand-slogan">Hotel Management Platform</p>
                    <div class="brand-decoration">
                    <div class="decoration-circle"></div>
                    <div class="decoration-circle"></div>
                    <div class="decoration-circle"></div>
                    </div>
                </div>
                </div>

                {/* <!-- 右侧注册表单 --> */}
                <div class="login-form-wrapper">
                <div class="login-form-container">

                    {/* <!-- 表单标题 --> */}
                    <div class="form-header">
                    <h2 class="form-title">用户注册</h2>
                    </div>

                    {/* <!-- 注册表单 --> */}
                    <Form className="login-form" id="registerForm" >
                        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请输入用户名（4-16位字符）" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </Form.Item>
                        <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请输入姓名（4-16位字符）" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </Form.Item>
                        <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请输入邮箱地址" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </Form.Item>
                        <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请输入手机号" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </Form.Item>
                        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请输入密码（6-20位）" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </Form.Item>
                        <Form.Item label="确认密码" name="confirmPassword" rules={[{ required: true, message: '请再次输入密码' }]}>
                            <div className="input-wrapper">
                                <Input placeholder="请再次输入密码" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        </Form.Item>         
                    </Form>

                    <Button type="button" className="btn btn-primary btn-block" onClick={handleRegister}>
                        注 册
                    </Button>

                    <div class="form-footer">
                        <span class="footer-text">已有账号？</span>
                        <a href="login" class="link-primary">立即登录</a>
                    </div>

                </div>
                </div>

            </div>
        </div>
    )
}

export default Register
