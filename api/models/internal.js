module.exports = (function () {
  var mongoose = require('../db').mongoose
  var schema = {
    hash: {type: String, index: true, required: true, unique: true}, // 唯一识别码 (plateNumber-operationTime)
    enterStation: {type: String}, // 入口站号
    enterCarType: {type: String}, // 入口车型
    enterTime: {type: Date, index: true, required: true}, // 入口时间
    enterPlateId: {type: String}, // 入口车牌
    exitStation: {type: String}, // 出口收费站
    exitLane: {type: String}, // 出口车道
    ICCard: {type: String}, // IC卡号
    exitTime: {type: Date, index: true, required: true}, // 出口时间
    operator: {type: String}, // 收费员
    workShift: {type: String}, // 班次
    carType: {type: String}, // 车型
    carKind: {type: String}, // 车种
    payType: {type: String}, // 车情
    situation: {type: String}, // 特情
    plateId: {type: String, index: true, required: true}, // 车牌号
    plateAllNumber: {type: String, index: true}, // 车牌号数字
    plateNumber: {type: String, index: true}, // 车牌号数字后三位
    plateColor: {type: String}, // 车牌颜色
    autoPlateId: {type: String}, // 自动车牌
    totalWeight: {type: String}, // 总重
    limitWeight: {type: String}, // 限重
    overweightRate: {type: String}, // 超限率
    amount: {type: String}, // 金额
    originalAmount: {type: String}, // 优惠前金额
    ETCId: {type: String}, // 电子支付卡号
    ETC2Id: {type: String}, // 二代卡号
    auditInformation: {type: String}, // 稽核信息
    importer: {type: String}, // 数据导入员
    importFileName: {type: String}, // 文件名
    importSheetName: {type: String}, // 表名
    importTime: {type: Date, default: Date.now} // 数据导入时间
  }
  return mongoose.model('internal', mongoose.Schema(schema))
})()
