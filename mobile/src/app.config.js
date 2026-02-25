export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/list/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易宿酒店',
    navigationBarTextStyle: 'black'
  },
  // 微信小程序定位权限声明（必填，否则 getLocation 失败）
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于为您推荐附近酒店'
    }
  },
  // 小程序需要的接口列表（微信基础库 2.17.3+）
  requiredPrivateInfos: ['getLocation']
})
