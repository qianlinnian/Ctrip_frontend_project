# 易宿酒店预订平台

第五期携程前端训练营大作业

## 项目结构

```
├── mobile/          # 移动端（用户端）- Taro + React
│   ├── src/
│   │   ├── pages/       # 页面
│   │   │   ├── home/    # 首页（酒店查询）
│   │   │   ├── list/    # 酒店列表
│   │   │   └── detail/  # 酒店详情
│   │   ├── components/  # 公共组件
│   │   ├── services/    # API服务
│   │   ├── utils/       # 工具函数
│   │   └── styles/      # 全局样式
│   └── package.json
│
├── management/      # PC端（管理系统）- React + Vite
│   ├── src/         # 商户：酒店录入 | 管理员：审核管理
│   │   ├── pages/       # 页面
│   │   │   ├── login/   # 登录注册
│   │   │   ├── hotel/   # 酒店信息录入
│   │   │   └── audit/   # 审核管理
│   │   ├── components/  # 公共组件
│   │   ├── services/    # API服务
│   │   ├── utils/       # 工具函数
│   │   └── styles/      # 全局样式
│   └── package.json
│
├── server/          # 后端服务 - Node.js + Express + MongoDB
│   ├── src/
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── middlewares/ # 中间件
│   │   ├── utils/       # 工具函数
│   │   └── config/      # 配置文件
│   └── package.json
│
└── 项目.md          # 项目说明文档
```

## 技术栈

| 端 | 技术 |
|---|---|
| 移动端 | React 18 + Taro 3 |
| PC端 | React 18 + Vite |
| 后端 | Node.js 18 + Express 4 + MongoDB + JWT |

## 快速开始

### 移动端
```bash
cd mobile
npm install
npm run dev:h5     # H5开发 调试网页效果
npm run dev:weapp  # 微信小程序开发 调试微信小程序
```

### PC管理端
```bash
cd management
npm install
npm run dev
```

### 后端服务
```bash
cd server
cp .env.example .env  # 配置环境变量
npm install
npm run dev
```
