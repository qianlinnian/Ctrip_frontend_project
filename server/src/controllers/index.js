/**
 * 控制器统一导出 - 移动端 API
 */
const hotelController = require('./hotelController')
const roomController = require('./roomController')
const cityController = require('./cityController')
const bookingController = require('./bookingController')

module.exports = {
  hotelController,
  roomController,
  cityController,
  bookingController
}
