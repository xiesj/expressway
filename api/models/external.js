module.exports = (function () {
  var mongoose = require('../db').mongoose
  var schema = {
    hash: {type: String, index: true, unique: true}, // 唯一识别码 (plateNumber-operationTime)
    workShift: {type: String}, // 班次
    pictureId: {type: String}, // 电子照片编号
    plateId: {type: String, index: true, required: true}, // 车牌照号
    plateAllNumber: {type: String, index: true, required: true}, // 车牌照号数字
    plateNumber: {type: String, index: true, required: true}, // 车牌照号数字后三位
    enterStation: {type: String}, // 入口站
    exitStation: {type: String}, // 出口站
    category: {type: String}, // 货物种类代码
    origOperationTime: {type: String}, // 原始操作时间
    operationTime: {type: Date, index: true, required: true}, // 操作时间
    freeAmount: {type: Number}, // 免费金额
    operator: {type: String}, // 验货人员
    supervisor: {type: String}, // 监控员
    leader: {type: String}, // 值班站领导
    importer: {type: String}, // 数据导入员
    importFileName: {type: String}, // 文件名
    importSheetName: {type: String}, // 表名
    importTime: {type: Date, default: Date.now}, // 数据导入时间
    confirmBy: {type: String}, // 确认人
    confirmAt: {type: Date, default: Date.now} // 确认时间
  }
  return mongoose.model('external', mongoose.Schema(schema))
})()
