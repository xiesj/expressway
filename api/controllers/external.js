const Router = require('restify-router').Router
const moment = require('moment')
const xlsx = require('xlsx')

const External = require('../models/external')
const Auth = require('../services/auth')

const router = new Router()
router.use(Auth)

router.post('/search', function (req, res, next) {
  if (!req.body.plate) {
    return res.send({
      'error': 'SEARCH_EXTERNAL_MISSING_PLATE'
    })
  }

  var searchCondition = {
  }

  if (req.body.plate.match(/^\d+$/)) {
    searchCondition.plateNumber = req.body.plate
  } else {
    searchCondition.plateId = req.body.plate
  }

  External.find(searchCondition).sort({operationTime: -1}).limit(30)
    .then(function (result) {
      return res.send({
        'list': result
      })
    })
    .then(null, function (err) {
      return res.send({
        'error': err
      })
    })
})

router.post('/list', function (req, res, next) {
  var searchCondition = {}
  if (req.body.date) {
    searchCondition.operationTime = {
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

  var total = 0
  External.count(searchCondition)
    .then(function (count) {
      total = count
      return External.find(searchCondition).sort({'operationTime': -1}).limit(limit).skip(skip)
    })
    .then(function (result) {
      return res.send({
        list: result,
        total: total
      })
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
  External.create(req.body)
    .then(function (result) {
      return res.send({
        'external': result
      })
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
          var workShiftName = getValue(sheet, 'A', 3)
          var firstColumnTitle = getValue(sheet, 'A', 4)
          if (workShiftName && firstColumnTitle === '电子照片编号') {
            var matches = workShiftName.replace(/\s/g, '').match(/班次：(.*?(\d+)年(\d+)月(\d+)日(.*?)时)至/)
            if (matches) {
              var workShift = matches[1]
              var year = parseInt(matches[2])
              var month = parseInt(matches[3])
              var day = parseInt(matches[4])
              var time = matches[5]
              var timeMatches = time.match(/(\d+?)\D*?(\d+?)?/)
              var hour = time
              var min = 0
              if (timeMatches) {
                hour = parseInt(timeMatches[1])
                min = parseInt(timeMatches[2]) || 0
              }
              var workShiftTime = moment([year, month - 1, day, hour, min])
              for (var n = 5; n < 65535; n++) {
                var plateId = getValue(sheet, 'B', n)
                if (!plateId) {
                  break
                }
                var plateNumber = ''
                var plateIdMatches = plateId.match(/\d/g)
                if (plateIdMatches) {
                  plateNumber = plateIdMatches.join('').substr(-3)
                }
                var entity = {
                  hash: null, // 唯一识别码 (plateId-operationTime)
                  workShift: workShift,
                  pictureId: getValue(sheet, 'A', n),
                  plateId: plateId,
                  plateNumber: plateNumber,
                  enterStation: getValue(sheet, 'C', n),
                  exitStation: getValue(sheet, 'D', n),
                  category: getValue(sheet, 'E', n),
                  origOperationTime: getValue(sheet, 'F', n),
                  operationTime: null,
                  freeAmount: getValue(sheet, 'G', n),
                  operator: getValue(sheet, 'H', n),
                  supervisor: getValue(sheet, 'I', n),
                  leader: getValue(sheet, 'J', n),
                  importer: req.session.user.name,
                  importFileName: fileName,
                  importSheetName: sheetName
                }
                if (entity.pictureId && entity.plateId && entity.enterStation && entity.exitStation && entity.category &&
                  entity.origOperationTime && entity.freeAmount && entity.operator && entity.supervisor && entity.leader) {
                  var operationTimeMatches = entity.origOperationTime.match(/^(\d*)\D(\d*)$/)
                  if (operationTimeMatches) {
                    var ohour = operationTimeMatches[1]
                    var omin = operationTimeMatches[2]
                    var operationTime = moment([year, month - 1, day, ohour, omin])
                    if (operationTime < workShiftTime) {
                      operationTime.add(1, 'day')
                    }
                    entity.operationTime = operationTime
                    entity.hash = entity.plateId + '-' + entity.operationTime.unix()
                    parseResult.push(entity)
                  }
                }
              }
            }
          }
        }
      }
    }
    return External.create(parseResult)
      .then(function (result) {
        if (result && result.length) {
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
