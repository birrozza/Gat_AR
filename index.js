// avvio server: npm start
// con ipconfig trova l'ip (IPV4)
// https://192.168.1.59:3000/

const express = require('express')
const https = require('https');
const fs = require('fs');

const app = express()

const port = 3000 

const data = [{
    id: 0,
    id_text: "text-temenide",
    id_img: "temenide",
    type: "location",
    text: "Via temenide ",
    imgURL: "assets/uscita-emergenza.jpg",
    lat: 40.462654,
    lon: 17.250845,
  },{
    id: 1,
    id_text: "text-gat",
    id_img: "gat",
    type: "location",
    text: "GAT ",
    imgURL: "assets/location.png",
    lat: 40.4233336,
    lon: 17.2858356,
  },{
    id: 2,
    id_text: "text-officina",
    id_img: "Officina",
    type: "location",
    text: "Officina ",
    imgURL: "assets/location.png",
    lat: 40.4233336,
    lon: 17.2858356,
  },{
    id: 3,
    id_text: "text-vito",
    id_img: "vito",
    type: "location",
    text: "Casa Nonno Vito ",
    imgURL: "assets/location.png",
    lat: 40.4663771,
    lon: 17.2471326,
  },{
    id: 4,
    id_text: "text-antonietta",
    id_img: "antonietta",
    type: "location",
    text: "Casa Nonna Antonietta ",
    imgURL: "assets/location.png",
    lat: 40.46705732564022,
    lon: 17.2545455,
  },{
    id: 5,
    type: "gltf-model",
    animation: {property: "rotation", 
                to: "0 360 0", 
                loop: true,
                dur: 20000, 
                easing: "linear"},
    text: "gltf-model_1 ",
    imgURL: "assets/savio/test_2.gltf",
    lat: 40.46705732564022,
    lon: 17.2545455,
  },{
    id: 6,
    type: "gltf-model",
    animation: {property: "rotation", 
                to: "0 360 0", 
                loop: true,
                dur: 20000, 
                easing: "linear"},
    text: "gltf-model_2 ",
    imgURL: "assets/magnemite/scene.gltf",
    lat: 40.46705732564022,
    lon: 17.2545455,            
  },{
    id: 7,
    id_text: "text-exit-cbf",
    id_img: "uscita_emergenza_cbf",
    type: "location",
    text: "Uscita Emergenza CBF ",
    imgURL: "assets/location.png",
    lat: 40.57714999886029,
    lon: 17.117072045803074, 
  },{
    id: 8,
    id_text: "text-exit-off",
    id_img: "uscita_emergenza_off",
    type: "location",
    text: "Uscita Emergenza Officina ",
    imgURL: "assets/location.png",
    lat: 40.57731705071694,
    lon: 17.116886973381046,
  },{
    id: 9,
    id_text: "alarm",
    id_img: "alarm_img",
    type: "location",
    text: "ALARM!!! ",
    imgURL: "assets/alert.png",
    lat: 40.57567910962963,
    lon: 17.11605548858643,        
  }
];     

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}

//app.use(express.static('pubblic'))

app.get('/', (req, res) =>{
  res.send('<h1>Hello World!!!</h1>');
});

app.get('/directory', (req, res) => {
  let param1 = req.query.id;
  let param2 = req.query.b;
  res.status(200).json(data);
  console.log('Send ok -', param1, param2)
});

app.get('/uuu', (req, res) =>{
  res.sendFile('location.png', {root: __dirname+'/assets'});
});

app.get('/ar', (req, res) => {
  //res.status(200).json([{success: true, b: "333"}])
  res.sendFile('index.html',{root: __dirname+'/'})
})

app.get('/server', (req, res) => {
  //res.status(200).json([{success: true, b: "333"}])
  res.sendFile('server.html',{root: __dirname+'/'})
})

const server = https.createServer(options, app);

server.listen(port, () => console.log(`Server running at https://localhost:${port}/\nor https://192.168.1.59:3000/\nverify width ipconfig (IPV4)`))
