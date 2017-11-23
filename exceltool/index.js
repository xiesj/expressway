const fs = require('fs')
const xlsx = require('node-xlsx')

if (process.argv[2]) {
  var filepath = process.argv[2]
  console.log(filepath)
  if (fs.existsSync(filepath)) {
    var sheets = xlsx.parse(filepath)
    if (sheets) {
      for (var i in sheets) {
        var sheet = sheets[i]
        var data = sheet.data
        var row1values = []
        for (var d in data) {
          var row = data[d]
          if (row[0] && row1values.indexOf(row[0]) < 0) {
            row1values.push(row[0])
          }
        }
        console.log('去重', row1values)
        for (d in data) {
          row = data[d]
          if (row[1] && row1values.indexOf(row[1]) >= 0) {
            sheets[i].data[d][1] = ''
          }
        }
      }
      var buffer = xlsx.build(sheets)
      var saveFilepath = filepath.replace(/(\..*?)$/g, '_r$1')
      fs.writeFile(saveFilepath, buffer, err => {
        if (err) throw err
        console.log('导出成功, 保存到', saveFilepath)
      })
    }
  } else {
    console.log('文件不存在')
  }
} else {
  console.log('输入文件名')
}
