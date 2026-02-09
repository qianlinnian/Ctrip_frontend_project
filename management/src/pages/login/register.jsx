import React, {useState, useEffect} from "react";
import '../../styles/pc-common.css'
import apiService from '../../services/api.js'


const Register = () => {

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordIsShow, setPasswordIsShow] = useState(false);


    function handleRegister() {

        console.log('Register:\n', 'username:', username, 'phone:', phone, 'email:', email, 'password:', password);
        if(password != confirmPassword) {
            console.log('passwords not match');
        }
        //apiService.request('/auth/register', {username: username, phone: phone, email: email, password: password});
    }

    function togglePassword() {
        setPasswordIsShow(passwordIsShow => !passwordIsShow);
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
                    <p class="form-subtitle">选择角色完成注册</p>
                    </div>

                    {/* <!-- 角色选择 --> */}
                    <div class="role-selector">
                    <div class="role-card" id="merchantRole" onclick="selectRole('merchant')">
                        <div class="role-icon">🏪</div>
                        <h3 class="role-title">商户</h3>
                        <p class="role-desc">上传和管理酒店信息</p>
                    </div>
                    <div class="role-card" id="adminRole" onclick="selectRole('admin')">
                        <div class="role-icon">👨‍💼</div>
                        <h3 class="role-title">管理员</h3>
                        <p class="role-desc">审核和发布酒店信息</p>
                    </div>
                    </div>

                    {/* <!-- 注册表单 --> */}
                    <form class="login-form" id="registerForm">
                    <input type="hidden" id="selectedRole" value=""/>

                    <div class="form-group">
                        <label class="form-label">用户名</label>
                        <div class="input-wrapper">
                        <span class="input-icon">👤</span>
                        <input
                            type="text"
                            class="form-input"
                            placeholder="请输入用户名（4-16位字符）"
                            id="username"
                            value= {username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">手机号</label>
                        <div class="input-wrapper">
                        <span class="input-icon">📱</span>
                        <input
                            type="tel"
                            class="form-input"
                            placeholder="请输入手机号"
                            id="phone"
                            value= {phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">邮箱</label>
                        <div class="input-wrapper">
                        <span class="input-icon">✉️</span>
                        <input
                            type="email"
                            class="form-input"
                            placeholder="请输入邮箱地址"
                            id="email"
                            value= {email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">密码</label>
                        <div class="input-wrapper">
                        <span class="input-icon">🔒</span>
                        <input
                            type={passwordIsShow ? "text" : "password"}
                            class="form-input"
                            placeholder="请输入密码（6-20位）"
                            id="password"
                            value= {password}
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span class="input-suffix" onClick={togglePassword}>👁️</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">确认密码</label>
                        <div class="input-wrapper">
                        <span class="input-icon">🔒</span>
                        <input
                            type={passwordIsShow ? "text" : "password"}
                            class="form-input"
                            placeholder="请再次输入密码"
                            id="confirmPassword"
                            value= {confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span class="input-suffix" onClick={togglePassword}>👁️</span>
                        </div>
                    </div>
            

                    <button type="button" class="btn btn-primary btn-block" onClick={handleRegister}>
                        注 册
                    </button>

                    <div class="form-footer">
                        <span class="footer-text">已有账号？</span>
                        <a href="login" class="link-primary">立即登录</a>
                    </div>
                    </form>

                </div>
                </div>

            </div>
        </div>
    )
}

export default Register
