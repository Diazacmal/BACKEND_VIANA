const dotenv = require('dotenv');
const { request, response } = require('express');
const Pool = require('pg').Pool

dotenv.config();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
})

const getRowsData = (request, response) => {
  pool.query('SELECT * FROM analytics_results ORDER BY id DESC LIMIT 10', (error, results) => {
    if (error) {
      throw error
    } 
    response.status(200).json(results.rows)
  })
}

const getChartData = (request, response) => {

  pool.query('SELECT * FROM analytics_results ORDER BY id DESC LIMIT 10', (error, results) => {
    if (error) {
      throw error
    }
    let rows = results.rows
    let mobil = Array.prototype.map.call(rows, function (item) { return item.mobil; }).join(",");
    let motor = Array.prototype.map.call(rows, function (item) { return item.motor; }).join(",");
    let bus = Array.prototype.map.call(rows, function (item) { return item.bus; }).join(",");
    let truk = Array.prototype.map.call(rows, function (item) { return item.truk; }).join(",");
    let sepeda = Array.prototype.map.call(rows, function (item) { return item.sepeda; }).join(",");
    let date = Array.prototype.map.call(rows, function (item) { return item.date; }).join(",");

    let datas = {
      'date': date,
      'mobil': mobil,
      'motor': motor,
      'bus': bus,
      'truk': truk,
      'sepeda': sepeda
    }
    //console.log(rows)
    //console.log('new: '+datas)

    //response.status(200).json(results.rows)
    response.status(200).json(datas)
  })
}


const getDataKendaraan = (request, response) => {
  pool.query('SELECT date, sepeda, motor, mobil, bus, truk ' +
    'FROM analytics_results ' +
    'ORDER BY id DESC LIMIT 10', (error, results) => {
      if (error) {
        throw error
      }
      const rows = results.rows

      response.status(200).json(rows)
    })
}




module.exports = {
  getRowsData,
  getChartData,
  getDataKendaraan,
  
}
