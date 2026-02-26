import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pc-common.css'
import apiService from '../../services/api.js'
import {Form, Button, Input} from 'antd';


const Login = () => {

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      console.log('Login:', account, password);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({account: account, password: password})
      })


        //登入成功
      if (response.ok) {
        const data =  await response.json()
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', data.data.user.username);
        localStorage.setItem('role', data.data.user.role);
        localStorage.setItem('id', data.data.user.id);
        console.log('Login Info Storage to Session', {token: data.data.token, username: data.data.user.username, role: data.data.user.role, id: data.data.user.id})

        //重定向到主页
        if(data.data.user.role === 'merchant') {
          navigate('/merchant/dashboard');
        } else if(data.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
  }



  return (
    <>
    <div class="login-page">
      <div class="login-container">
        {/* 左侧品牌区域 */}
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

        {/* 右侧登录表单 */}
        <div class="login-form-wrapper">
          <div class="login-form-container">

            {/*- 表单标题 */}
            <div class="form-header">
              <h2 class="form-title">账号登录</h2>
              <p class="form-subtitle">欢迎使用易宿酒店管理平台</p>
            </div>

            <Form className="login-form" id="passwordForm">
              <div class="form-group">
                <Form.Item label="账号" name="account" rules={[{required: true, message: '请输入账号'}]}> 
                  <Input placeholder="请输入账号/手机号/邮箱" id="username" value={account} onChange={(e) => setAccount(e.target.value)} />
                </Form.Item>
              </div>

              <div class="form-group">
                <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入密码'}]}> 
                  <Input placeholder="请输入密码" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
              </div>

              <div class="form-row">
                <label class="checkbox-wrapper">
                  <input type="checkbox" class="form-checkbox" />
                  <span class="checkbox-label">记住我</span>
                </label>
                <a href="javascript:void(0)" class="link-text" onclick="alert('忘记密码功能')">忘记密码？</a>
              </div>

              <Button type="primary" className="btn btn-primary btn-block" onClick={handleLogin}>
                登 录
              </Button>

              <div class="form-footer">
                <span class="footer-text">还没有账号？</span>
                <a href="/register" class="link-primary">立即注册</a>
              </div>
            </Form>
            {/* 登录表单 */}
            <form class="login-form" id="passwordForm">
              
            </form>
          </div>
        </div>

      </div>
    </div>
    </>
  )
};

export default Login;
