const Router = require('restify-router').Router
const moment = require('moment')
const xlsx = require('xlsx')

const External = require('../models/external')
const Internal = require('../models/internal')
const Auth = require('../services/auth')

const router = new Router()
router.use(Auth)

var findPlateIn24Hours = function (plateId, exitTime) {
  return External.findOne({
    plateId: plateId,
    operationTime: {
      '$gte': moment(exitTime).subtract(24, 'hour'),
      '$lt': moment(exitTime)
    }
  })
}

router.post('/list', function (req, res, next) {
  var searchCondition = {}
  if (req.body.date) {
    searchCondition.exitTime = {
      '$gte': moment(req.body.date).startOf('day'),
      '$lt': moment(req.body.date).endOf('day')
    }
  }
  if (req.body.plate) {
    if (req.body.plate.match(/^\d+$/)) {
      searchCondition.plateNumber = req.body.plate
    } else {
      searchCondition.plateId = req.body.plate
    }
  }

  const limit = 20
  var skip = 0
  if (req.body.page) {
    skip = (parseInt(req.body.page) - 1) * limit
  }

  var aggregates = [
    {'$match': searchCondition},
    {'$sort': { 'exitTime': -1 }},
    {'$skip': skip},
    {'$limit': limit}
  ]

  var total = 0
  Internal.count(searchCondition)
    .then(function (count) {
      total = count
      return Internal.aggregate(aggregates).exec()
    })
    .then(function (result) {
      if (result && result.length) {
        var compareQuery = []
        for (var i in result) {
          compareQuery.push(findPlateIn24Hours(result[i].plateId, result[i].exitTime))
        }
        Promise.all(compareQuery)
          .then(function (compareResult) {
            return res.send({
              compareResult: compareResult,
              list: result,
              total: total
            })
          })
      } else {
        return res.send({
          'error': 'INTERNAL_DATA_NO_CONTENT'
        })
      }
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.post('/add', function (req, res, next) {
  if (!req.body.plateId) {
    return res.send({
      'error': 'ADD_EXTERNAL_DATA_PLATENUMBER_WRONG'
    })
  }
  Internal.create(req.body)
    .then(function (result) {
      if (result && result.length) {
        return res.send({
          'inserted': result.length
        })
      }
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

function getValue (sheet, column, row) {
  if (sheet[column + row]) {
    return sheet[column + row].w
  } else {
    return null
  }
}

router.post('/import', function (req, res, next) {
  if (req.files && req.files.file) {
    var parseResult = []
    var fileName = req.files.file.name
    var workbook = xlsx.readFile(req.files.file.path)
    if (workbook && workbook.Workbook && workbook.Workbook.Sheets) {
      for (var i in workbook.Workbook.Sheets) {
        if (workbook.Workbook.Sheets[i] && workbook.Workbook.Sheets[i].Hidden === 0) {
          var sheetName = workbook.Workbook.Sheets[i].name
          var sheet = workbook.Sheets[sheetName]
          var firstColumnTitle = getValue(sheet, 'A', 4)
          if (firstColumnTitle === '入口站号') {
            for (var n = 5; n < 65535; n++) {
              var origPlateNumber = getValue(sheet, 'O', n)
              var exitTime = getValue(sheet, 'H', n)
              if (!origPlateNumber || !exitTime) {
                break
              }

              var plateId = origPlateNumber
              var plateNumber = ''
              var plateColor = ''
              var plateMatches = origPlateNumber.match(/^(黄|蓝)(.*)$/)
              if (plateMatches) {
                plateColor = plateMatches[1]
                plateId = plateMatches[2]
                var plateIdMatches = plateId.match(/\d/g)
                if (plateIdMatches) {
                  plateNumber = plateIdMatches.join('').substr(-3)
                }
              }

              var hash = plateId + '-' + moment(exitTime).unix()
              var entity = {
                hash: hash, // 唯一识别码 (plateId-exitTime)
                enterStation: getValue(sheet, 'A', n), // 入口站号
                enterCarType: getValue(sheet, 'B', n), // 入口车型
                enterTime: moment(getValue(sheet, 'C', n)), // 入口时间
                enterPlateNumber: getValue(sheet, 'D', n), // 入口车牌
                exitStation: getValue(sheet, 'E', n), // 出口收费站
                exitLane: getValue(sheet, 'F', n), // 出口车道
                ICCard: getValue(sheet, 'G', n), // IC卡号
                exitTime: moment(exitTime), // 出口时间
                operator: getValue(sheet, 'I', n), // 收费员
                workShift: getValue(sheet, 'J', n), // 班次
                carType: getValue(sheet, 'K', n), // 车型
                carKind: getValue(sheet, 'L', n), // 车种
                payType: getValue(sheet, 'M', n), // 车情
                situation: getValue(sheet, 'N', n), // 特情
                plateId: plateId, // 车牌照
                plateNumber: plateNumber, // 车牌照数字
                plateColor: plateColor, // 车牌颜色
                autoPlateNumber: getValue(sheet, 'P', n), // 自动车牌
                totalWeight: getValue(sheet, 'Q', n), // 总重
                limitWeight: getValue(sheet, 'R', n), // 限重
                overweightRate: getValue(sheet, 'S', n), // 超限率
                amount: getValue(sheet, 'T', n), // 金额
                originalAmount: getValue(sheet, 'U', n), // 优惠前金额
                ETCId: getValue(sheet, 'V', n), // 电子支付卡号
                ETC2Id: getValue(sheet, 'W', n), // 二代卡号
                auditInformation: getValue(sheet, 'X', n), // 稽核信息
                importer: req.session.user.name, // 数据导入员
                importFileName: fileName, // 文件名
                importSheetName: sheetName // 表名
              }
              if (entity.hash && entity.enterStation && entity.enterTime && entity.exitStation && entity.exitLane && entity.exitTime &&
              entity.operator && entity.plateId && entity.totalWeight && entity.originalAmount) {
                parseResult.push(entity)
              } else {
                break
              }
            }
          }
        }
      }
    }
    return Internal.create(parseResult)
      .then(function (result) {
        if (result) {
          return res.send({
            'inserted': result.length
          })
        }
      })
      .then(null, function (err, result) {
        return res.send({
          'error': err
        })
      })
  } else {
    return res.send({
      'error': 'EXTERNAL_IMPORT_UPLOAD_NO_FILE'
    })
  }
})

module.exports = router
