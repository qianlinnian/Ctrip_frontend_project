import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pc-common.css'
import apiService from '../../services/api.js'

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      console.log('Login:', username, password);
      const response = await apiService.request('/auth/login', {username: username, password: password});
      console.log('request to', '/auth/login', 'with', {username: username, password: password})
      console.log(response);

        //登入成功
      if (response && response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        //重定向到主页
        navigate('/merchant-dashboard');
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

            {/* 登录表单 */}
            <form class="login-form" id="passwordForm">
              <div class="form-group">
                <label class="form-label">账号</label>
                <div class="input-wrapper">
                  <span class="input-icon">👤</span>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="请输入账号/手机号/邮箱"
                    autocomplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">密码</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input
                    type="password"
                    class="form-input"
                    placeholder="请输入密码"
                    autocomplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span class="input-suffix" onclick="togglePassword(this)">👁️</span>
                </div>
              </div>

              <div class="form-row">
                <label class="checkbox-wrapper">
                  <input type="checkbox" class="form-checkbox" />
                  <span class="checkbox-label">记住我</span>
                </label>
                <a href="javascript:void(0)" class="link-text" onclick="alert('忘记密码功能')">忘记密码？</a>
              </div>

              <button type="button" class="btn btn-primary btn-block" onClick={handleLogin}>
                登 录
              </button>

              <div class="form-footer">
                <span class="footer-text">还没有账号？</span>
                <a href="/register" class="link-primary">立即注册</a>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
    </>
  )
};

export default Login;
