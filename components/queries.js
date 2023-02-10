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

pool.connect((err)=>{
  if (err) throw err
  console.log('data connect')
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
      'date': date.split(",").map((date)=>date),
      'mobil':mobil.split(",").map((mobil) => mobil),
      'motor': motor.split(",").map((motor) => motor),
      'bus': bus.split(",").map((bus) =>bus ),
      'truk': truk.split(",").map((truk) =>truk ),
      'sepeda': sepeda.split(",").map((sepeda) =>sepeda )
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
const getCCTV =(req,res)=>{
  pool.query('SELECT * From cameras ',(error,results)=>{
if (error){
  throw error
}
const hasil =results.rows

res.status(200).json(hasil)
  })
}



 const addcctv =(req,res)=>{
  
  const{id_user,name,rtsp_url}=req.body
  console.log(req.body)
  
  pool.query('SELECT s FROM  cameras s WHERE  s.name ',[name],(error,results)=>{

        if(results){
          return res.send( "nama terlah di gunakan mohon di ganti " )
        }
      })

  // check if email  exits.
  pool.query (`INSERT INTO cameras ( id_user,name,rtsp_url )   VALUES ( $1,$2,$3);`,
  [id_user,name,rtsp_url],(error,result)=>{

    if(error) throw error
    {
      res.status(201).send(" selamat data anda berhasil di input ")
    }
  })
  
}

const updatecctv = async (req, res) => {
  const id = parseInt(req.params.id);
  const {id_user,name,rtsp_url} = req.body;
  await pool.query("select * from cameras  where id_user =$1", [id_user], (error, results) => {
    const Nodata = !results.rows.length;

    if (Nodata) {
      res.send("nama ini tidak ada di database tidak bisa di update ");
    }
   pool.query(
      `UPDATE cameras SET name=$1, rtsp_url=$2 WHERE id_user=$3;`,
      [name,rtsp_url,id],
      (error, results) => {
        if (error) throw error;
        res.status(200).send(`akun ini berhasil di update dengan id = ${id}`);
      }
    );
  }); 
};

const service =(req,res)=>{
  pool.query('SELECT * From  services ',(error,results)=>{
    if (error){
      throw error
    }
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}


const addservice =(req,res)=>{
  
  const{id_service,name}=req.body
  console.log(req.body)
  db.query('SELECT s FROM   WHERE  s.username=$1 ',[username],(error,results)=>{

        if(results.rows.length){
          return res.send( "nama terlah di gunakan mohon di ganti " )
        }
      })
  // check if email  exits.
  pool.query (`INSERT INTO services (id_service,name,rstp_url)   VALUES ( $1,$2);`,
  [id_service,name,rtsp_url],(error,result)=>{

    if(error) throw error
    {
      res.status(201).send(" selamat data anda berhasil di input ")
    }
  })
  
}


module.exports = {
  getRowsData,
  getChartData,
  getDataKendaraan,
  getCCTV,
  addcctv,
  updatecctv,
  addservice,
  service
}
