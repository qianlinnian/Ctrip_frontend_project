export default defineAppConfig({
  pages: [
    'pages/home/index',      // 首页（酒店查询）
    'pages/list/index',      // 酒店列表页
    'pages/detail/index'     // 酒店详情页
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易宿',
    navigationBarTextStyle: 'black'
  }
})
