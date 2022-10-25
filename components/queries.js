const dotenv = require('dotenv')
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
  getDataKendaraan
}
