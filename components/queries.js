const dotenv = require('dotenv');

const { request, response } = require('express');
const moment = require('moment/moment');
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

// CCTV 
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
  
  const{id_user,name,rtsp_url,longitude,latitude}=req.body
  // console.log(req.body)
  
  pool.query('SELECT * From cameras  WHERE name=$1 ',[name],(error,results)=>{
    if (error){
      throw error
    }
    try {
      const hasil =results.rows.length
    if(hasil){
      res.send('data terlah ada ')
    }else{
      pool.query (`INSERT INTO cameras ( id_user,name,rtsp_url,latitude,longitude )   VALUES ( $1,$2,$3,$4,$5);`,
      [id_user,name,rtsp_url,latitude,longitude],(error,result)=>{

      if(error) throw error
      {
      res.status(201).send(" selamat data anda berhasil di input ")
      }
  })
    }
    } catch (error) {;
      console.log(err);
      res.status(500).json({
      error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
      });
    
    }
  

  })
}
    

  
  
  


const updatecctv = async (req, res) => {
  const id_user = req.params.id_user;
  
  const {name,rtsp_url} = req.body;
  await pool.query("select * from cameras  where id_user =$1", [id_user], (error, results) => {
    const Nodata = !results.rows.length;

    if (Nodata) {
      res.send("nama ini tidak ada di database tidak bisa di update ");
      
    }
   pool.query(
      `UPDATE cameras SET name=$1, rtsp_url=$2 WHERE id_user=$3;`,
      [name,rtsp_url,id_user],
      (error, results) => {
        if (error) throw error;
        res.status(200).send(`akun ini berhasil di update dengan id = ${id_user}`);
      }
    );
  }); 
};


// SERVICE_viana
const service =(req,res)=>{
  pool.query('SELECT * From  services_viana ',(error,results)=>{
    if (error){
      throw error
    }
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}


const addservice =(req,res)=>{
  
  const{id,nama_feature,nama_service,status}=req.body

  
  pool.query('SELECT * From services_viana  WHERE nama_feature=$1 ',[nama_feature],(error,results)=>{
    if (error){
      throw error
    }
    try {
      const hasil =results.rows.length
    if(hasil){
      res.send('data terlah ada ')
    }else{
      pool.query (`INSERT INTO services_viana ( id,nama_feature,nama_service,status )   VALUES ( $1,$2,$3,$4);`,
      [id,nama_feature,nama_service,status],(error,result)=>{

      if(error) throw error
      {
      res.status(201).send(" selamat data anda berhasil di input ")
      }
  },{

    id:id.id,
    nama_feature:nama_feature.nama_feature,
    status:status.status
  })
    }
    } catch (error) {;
      console.log(err);
      res.status(500).json({
      error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
      });
    
    }
  

  })
}


// ANOMALY_analiytics
const  anomaly  =(req,res)=>{
  pool.query('SELECT * From  anomaly_analiytics ',[],(error,results)=>{
    if (error){
      throw error
    }
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}

const add_anomaly =(req,res)=>{
const{id,jenis_anomaly,count,image,timestamps}=req.body
pool.query('SELECT * From service_viana  WHERE jenis_anomaly=$1 ',[jenis_anomaly],(error,results)=>{
  if (error){
    throw error
  }
  try {
    const hasil =results.rows.length
  if(hasil){
    res.send('data terlah ada ')
  }else{
    pool.query (`INSERT INTO service_viana ( id,jenis anomaly,count,image )   VALUES ( $1,$2,$3,$4);`,
    [id,jenis_anomaly,count,image,timestamps],{
      id:id.id,
      jenis_anomaly:jenis_anomaly.jenis_anomaly,
      count:count.count,
      image:image.image,
      timestamps:moment().format('HH-mm')
    },
    (error,result)=>{
    if(error) throw error
    {
    res.status(201).send(" selamat data anda berhasil di input ")
    }
})
  }
  } catch (error) {;
    console.log(err);
    res.status(500).json({
    error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
    });
  
}
})}

// FISH_analiytics
const  fish =(req,res)=>{
  pool.query('SELECT * From  fish_analiytics ',(error,results)=>{
    if (error){
      throw error
    }
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}

const add_fish=(req,res)=>{
  const{id,jenis_ikan,berat_ikan,luas_ikan,gambar}=req.body
  pool.query('SELECT * From fish_analytics WHERE id=$1 ',[id],(error,results)=>{
    if (error){
      throw error
    }
    try {
      const hasil =results.rows.length
    if(hasil){
      res.send('data terlah ada ')
    }else{
      pool.query (`INSERT INTO fish_analytics (id,jenis_ikan,berat_ikan,luas_ikan,gambar )   VALUES ( $1,$2,$3,$4,$5,$6);`,
      [id,jenis_ikan,berat_ikan,luas_ikan,gambar],(error,result)=>{

      if(error) throw error
      {
      res.status(201).send(" selamat data anda berhasil di input ")
      }
  })
    }
    } catch (error) {;
      console.log(err);
      res.status(500).json({
      error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
      });
    
    }
  })}


// SOCIAL_DISTANCING
const  socialdistancing_analytic =(req,res)=>{
  pool.query('SELECT * From  socialdistancing_analytic ',(error,results)=>{
    if (error){
      throw error
    }
    console.log(req.body)
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}

const add_socialdistancing =(req,res)=>{
  const{id,count_people,high_risk,low_risk}=req.body
  console.log(req.body)
  pool.query('SELECT * From socialdistancing_analytic  WHERE id=$1 ',[id],(error,results)=>{
    if (error){
      throw error
    }
    try {
      const hasil =results.rows.length
    if(hasil){
      res.send('data terlah ada ')
    }else{
      pool.query (`INSERT INTO socialdistancing_analytic ( id,count_people,high_risk,low_risk )   VALUES ( $1,$2,$3,$4);`,
      [id,count_people,high_risk,low_risk],(error,result)=>{

      if(error) throw error
      {
      res.status(201).send(" selamat data anda berhasil di input ")
      }
  })
    }
    } catch (error) {;
      console.log(err);
      res.status(500).json({
      error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
      });
    }})
}

// SKPJ_ANALYTICS
const  skpj  =(req,res)=>{
  pool.query('SELECT * From  skpj_analytics ',(error,results)=>{
    if (error){
      throw error
    }
    const hasil =results.rows
    
    res.status(200).json(hasil)
      })
}
const add_skpj =(req,res)=>{
const {id,jenis_kerusakan,presentase_keyakinan,luas_kerusakan,timestamps,longitude,altitude,gambar}=req.body
pool.query('SELECT * From skpj_analytics WHERE id=$1 ',[id],(error,results)=>{
  if (error){
    throw error 
  }
  try {
    const hasil =results.rows.length
  if(hasil){
    res.send('data terlah ada ')
  }else{
    pool.query (`INSERT INTO skpj_analytics( id,jenis_kerusakan,presentase_keyakinan,luas_kerusakan,timestamps,longitude,altitude,gambar )   VALUES ( $1,$2,$3,$4,$5,$6,$7,$8);`,
    [id,jenis_kerusakan,presentase_keyakinan,luas_kerusakan,timestamps,longitude,altitude,gambar],(error,result)=>{

    if(error) throw error
    {
    res.status(201).send(" selamat data anda berhasil di input ")
    }
})
  }
  } catch (error) {;
    console.log(err);
    res.status(500).json({
    error: "Database error tidak bisa menambahkan data  harap tunggu beberapa saat !", //Database connection error
    });
  }})

}






module.exports = {
  getRowsData,
  getChartData,
  getDataKendaraan,
  getCCTV,
  addcctv,
  updatecctv,
  addservice,
  service,
  anomaly,
  add_anomaly,
  skpj,
  add_skpj,
  socialdistancing_analytic,
  add_socialdistancing,
  fish,
  add_fish
}
