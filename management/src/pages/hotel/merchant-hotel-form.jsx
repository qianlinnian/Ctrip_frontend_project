import react, { useState } from 'react';


const MerchantHotelForm = () => {



    return (
        <>
            <div className="admin-layout">

                {/* <!-- 侧边栏 --> */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <h1 className="sidebar-logo">易宿酒店</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>商户端</p>
                    </div>
                    <nav className="sidebar-menu">
                        <div className="menu-item active">
                            <span className="menu-icon">🏨</span>
                            <span>我的酒店</span>
                        </div>
                    </nav>
                </aside>

                {/* <!-- 主内容区 -->   */}
                <main className="admin-main">

                    {/* <!-- 顶部栏 --> */}
                    <header className="admin-header">
                        <div className="header-left">
                            <h2 className="page-title">酒店信息录入/编辑</h2>
                        </div>
                        <div className="header-right">
                            <div className="header-user" onclick="showUserMenu()">
                                <div className="user-avatar">商</div>
                                <span className="user-name">商户账号</span>
                                <span>▼</span>
                            </div>
                        </div>
                    </header>

                    {/* <!-- 内容区 --> */}
                    <div className="admin-content">

                        {/* <!-- 表单卡片 --> */}
                        <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>

                            <h3 style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--text-primary)' }}>
                                基本信息
                            </h3>

                            <form id="hotelForm">

                                {/* <!-- 酒店名称 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        酒店名称 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="请输入酒店名称"
                                        id="hotelName"
                                    />
                                </div>

                                {/* <!-- 所属城市 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        所属城市 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <select className="input" id="city">
                                        <option value="">请选择城市</option>
                                        <option value="上海">上海</option>
                                        <option value="北京">北京</option>
                                        <option value="广州">广州</option>
                                        <option value="深圳">深圳</option>
                                        <option value="杭州">杭州</option>
                                        <option value="成都">成都</option>
                                    </select>
                                </div>

                                {/* <!-- 详细地址 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        详细地址 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="请输入详细地址（街道、门牌号）"
                                        id="address"
                                    />
                                </div>

                                {/* <!-- 酒店星级 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        酒店星级 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <div className="star-selector">
                                        <label className="star-option">
                                            <input type="radio" name="star" value="3" />
                                            <span>⭐⭐⭐ 三星级</span>
                                        </label>
                                        <label className="star-option">
                                            <input type="radio" name="star" value="4" />
                                            <span>⭐⭐⭐⭐ 四星级</span>
                                        </label>
                                        <label className="star-option">
                                            <input type="radio" name="star" value="5" />
                                            <span>⭐⭐⭐⭐⭐ 五星级</span>
                                        </label>
                                    </div>
                                </div>

                                {/* <!-- 房间数量 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        房间数量 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="请输入房间总数"
                                        id="roomCount"
                                        min="1"
                                    />
                                </div>

                                {/* <!-- 起始价格 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        起始价格（元/晚） <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="请输入最低房价"
                                        id="price"
                                        min="0"
                                    />
                                </div>

                                {/* <!-- 联系电话 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        联系电话 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className="input"
                                        placeholder="请输入酒店联系电话"
                                        id="phone"
                                    />
                                </div>

                                {/* <!-- 酒店简介 --> */}
                                <div className="form-group">
                                    <label className="form-label">酒店简介</label>
                                    <textarea
                                        className="input"
                                        rows="4"
                                        placeholder="请输入酒店简介（选填）"
                                        id="description"
                                        style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                    ></textarea>
                                </div>

                                {/* <!-- 设施标签 --> */}
                                <div className="form-group">
                                    <label className="form-label">设施标签</label>
                                    <div className="tag-selector">
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="免费停车" />
                                            <span>免费停车</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="免费WiFi" />
                                            <span>免费WiFi</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="有早餐" />
                                            <span>有早餐</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="近地铁" />
                                            <span>近地铁</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="游泳池" />
                                            <span>游泳池</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="健身房" />
                                            <span>健身房</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="会议室" />
                                            <span>会议室</span>
                                        </label>
                                        <label className="tag-checkbox">
                                            <input type="checkbox" value="接机服务" />
                                            <span>接机服务</span>
                                        </label>
                                    </div>
                                </div>

                                {/* <!-- 酒店图片上传 --> */}
                                <div className="form-group">
                                    <label className="form-label">酒店图片</label>
                                    <div className="upload-area" onclick="alert('图片上传功能\n\n实际项目中这里会：\n1. 支持多图上传\n2. 图片预览\n3. 图片裁剪\n4. 上传到OSS云存储')">
                                        <div className="upload-icon">📷</div>
                                        <p>点击上传酒店图片</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                                            支持 JPG、PNG 格式，最多上传10张
                                        </p>
                                    </div>
                                </div>

                                {/* <!-- 营业执照上传 --> */}
                                <div className="form-group">
                                    <label className="form-label">
                                        营业执照 <span style={{ color: 'var(--error-color)' }}>*</span>
                                    </label>
                                    <div className="upload-area" onclick="alert('营业执照上传功能')">
                                        <div className="upload-icon">📄</div>
                                        <p>点击上传营业执照扫描件</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                                            必须上传清晰的营业执照照片用于审核
                                        </p>
                                    </div>
                                </div>

                                {/* <!-- 提交按钮 --> */}
                                <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                    <button type="button" className="btn btn-outline" style={{ width: '120px' }} onclick="handleCancel()">
                                        取消
                                    </button>
                                    <button type="button" className="btn btn-primary" style={{ width: '120px' }} onclick="handleSubmit()">
                                        提交审核
                                    </button>
                                    <button type="button" className="btn" style={{ width: '120px', background: '#F5F5F5' }} onclick="handleSaveDraft()">
                                        保存草稿
                                    </button>
                                </div>

                            </form>

                        </div>

                    </div>

                </main>

            </div>
        </>
    )
};


export default MerchantHotelForm;
