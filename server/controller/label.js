const fs = require('fs')
const ObjectId = require('mongodb').ObjectId;
const json2csv = require('json2csv');


exports.getLabels = async (ctx) => {
  try {
    const { keys, values, currentPage, currentSize } = ctx.request.body;
    const Temp = ctx.db.collection('temp');
    let query = {};
    for (var i in keys) {
      query[keys[i]] = values[i]
    }
    let total = await Temp.find(query).count({ 'type': 1 })
    const pageDate = await Temp.find(query).skip((currentPage - 1) * currentSize).limit(currentSize).toArray()
    if (!pageDate || !total) { return ctx.api({ code: 201, data: { pageDate, total } }) }
    ctx.api({ code: 202, data: { pageDate, total } })
  } catch (e) {
    ctx.api({ code: 500 })
    console.log(e)
  }
}

exports.updateLabel = async (ctx) => {
  try {
    const document = ctx.request.body;
    const Temp = ctx.db.collection('temp');
    const newDocument = Object.assign(document, { '_id': ObjectId(document._id) })
    let { result } = await Temp.save(newDocument)
    if (!result.n && !result.ok) {
      return ctx.api({ code: 204 })
    }
    ctx.api({ code: 203 })
  } catch (e) {
    ctx.api({ code: 500 })
    console.log(e)
  }
}

exports.downloadLabel = async (ctx) => {
  try {
    const { keys, values } = ctx.request.body;
    let query = {};
    for (var i in keys) {
      query[keys[i]] = values[i]
    }
    const Temp = ctx.db.collection('temp');
    const totalResult = await Temp.find(query).toArray()
    if (totalResult.length === 0) { return ctx.api({ code: 201 })}
    const fields = ['file_dir', 'filename', '_id'];
    const csv = json2csv({ data: totalResult, fields: fields });
    const filename = `${new Date().getTime()}.csv`
    fs.writeFile(`${__dirname}/../../files/${filename}`, csv, function (err) {
      if (err) { throw err }
      console.log(`save file to ${__dirname}/../../files/${filename}`)
    });
    ctx.api({ code: 206, data: filename })
  } catch (e) {
    ctx.api({ code: 500 })
    console.log(e)
  }
}

