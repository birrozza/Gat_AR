// avvio server: npm start
// con ipconfig trova l'ip (IPV4)
// https://192.168.1.59:3000/

/***********************************************************
 * IMPORTANTE: per poter usare questa versione con axsios, 
 * eliminare in package.json la chiave "type": "module"
 * e usare reqiore al posto di import
 ***********************************************************/

const express = require('express')
const https = require('https');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

var dato = JSON.stringify({
  "collection": "POI",
  "database": "AR_DB",
  "dataSource": "Cluster0",
  "projection": {
    "id_text": 1,
    "id_img": 1,
    "type": 1, 
    "text": 1, 
    "imgURL": 1,
    "lat": 1,
    "lon": 1,
    //"remove": 1 
  }
});
            
var config = {
  method: 'post',
  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-qwnap/endpoint/data/v1/action/find',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': 'yWBEXsVPl43ttmBjHb3RWFqEaMcKIsVq5fJWbik5UpjtjLpipPBXheuO2FiWrIaI',
  },
  data: dato
};
            
function MongoDBFetch(){
  console.log('Mi collega al DB...');
  axios(config)
  .then(function (response) {
      data=response.data.documents;
      data.map(item =>{
        switch (item.type) {
          case "location": item.imgURL = '/assets/location.png';              
            break;
          case "alert": item.imgURL = '/assets/alert.png';              
            break;
          case "raccolta": item.imgURL = '/assets/raccolta.jpg';              
            break;      
          case "exit": item.imgURL = '/assets/uscita-emergenza.jpg';              
            break;
        } // ~ switch
      }); // ~ map
      console.log("Dati ricevuti dal DB")
  }) // then
  .catch(function (error) {
      console.log("Errore con MongoDB", error);
  });
}

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}

MongoDBFetch(); // recupera i dati dal DB all'avvio

let fetchDalDB = setInterval(() =>  MongoDBFetch() , 10000); // recupera i dati dal DB ogni 10 sec

app.use('/assets', express.static('assets')); // per poter recuperare i file immagine

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) =>{
  res.send('<h1>Hello World!!!</h1><h2>By Angelo MIRABELLI</h2>');
});

app.get('/directory', (req, res) => { // `/directory?id=${unicID}&b=val2`
  const {id, b} = req.query; 
  res.status(200).json(data);
  console.log('Send ok -', id, b)
});
 
app.get('/server', (req, res) => {
  //res.status(200).json([{success: true, b: "333"}])
  res.sendFile('server.html',{root: __dirname+'/'})
})



const server = https.createServer(options, app);

server.listen(port, () => console.log(`Server running at https://localhost:${port}/\nor https://192.168.1.59:3000/\nverify width ipconfig (IPV4)`));

/*
app.get('/uuu', (req, res) =>{
  res.sendFile('location.png', {root: __dirname+'/assets'});
});

app.get('/ar', (req, res) => {
  //res.status(200).json([{success: true, b: "333"}])
  res.sendFile('index.html',{root: __dirname+'/'})
})

const data = [{
    id: 0,
    id_text: "text-temenide",
    id_img: "temenide",
    type: "location",
    text: "Via temenide ",
    imgURL: uscitaEmergenzaURL,
    lat: 40.462654,
    lon: 17.250845,
    remove: true,
  },{
    id: 1,
    id_text: "text-gat",
    id_img: "gat",
    type: "location",
    text: "GAT ",
    imgURL: locationURL,
    lat: 40.4233336,
    lon: 17.2858356,
    remove: true,
  },{
    id: 2,
    id_text: "text-officina",
    id_img: "Officina",
    type: "location",
    text: "Officina ",
    imgURL: locationURL,
    lat: 40.4233336,
    lon: 17.2858356,
    remove: true,
  },{
    id: 3,
    id_text: "text-vito",
    id_img: "vito",
    type: "location",
    text: "Casa Nonno Vito ",
    imgURL: locationURL,
    lat: 40.4663771,
    lon: 17.2471326,
    remove: true,
  },{
    id: 4,
    id_text: "text-antonietta",
    id_img: "antonietta",
    type: "location",
    text: "Casa Nonna Antonietta ",
    imgURL: locationURL,
    lat: 40.46705732564022,
    lon: 17.2545455,
    remove: true,
  },{/*
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
    remove: true,
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
    remove: true,            
  },{*//*
    id: 7,
    id_text: "text-exit-cbf",
    id_img: "uscita_emergenza_cbf",
    type: "location",
    text: "Uscita Emergenza CBF ",
    imgURL: locationURL,
    lat: 40.57714999886029,
    lon: 17.117072045803074,
    remove: true, 
  },{
    id: 8,
    id_text: "text-exit-off",
    id_img: "uscita_emergenza_off",
    type: "location",
    text: "Uscita Emergenza Officina ",
    imgURL: locationURL,
    lat: 40.57731705071694,
    lon: 17.116886973381046,
    remove: true,
  },{
    id: 9,
    id_text: "alarm",
    id_img: "alarm_img",
    type: "location",
    text: "ALARM!!! ",
    imgURL: alertURL,
    lat: 40.57567910962963,
    lon: 17.11605548858643, 
    remove: true,       
  }
];     */
