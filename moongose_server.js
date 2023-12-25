// avvio server: npm start
// con ipconfig trova l'ip (IPV4)
// https://192.168.1.59:3000/
// Angelo
// floriana
// mongodb+srv://Angelo:floriana@cluster0.aq0nagc.mongodb.net/AR_DB?retryWrites=true&w=majority
/***********************************************************
 * IMPORTANTE: per poter usare questa versione con mongoose, 
 * inserire in package.json la chiave "type": "module"
 * e usare import al posto di require
 ***********************************************************/

//const express = require('express')
import express from 'express';
//const https = require('https');
import https from 'https';
//const fs = require('fs');
import fs from 'fs';
//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { setInterval } from 'timers/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let data = []; 
const app = express();

app.use('/assets', express.static('assets')); // per poter recuperare i file immagine

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const port = 3000;

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}
const server = https.createServer(options, app);

mongoose.set("strictQuery", false);
const mongodb = "mongodb+srv://Angelo:floriana@cluster0.aq0nagc.mongodb.net/AR_DB?retryWrites=true&w=majority";

// definisci lo schema
const schema = new mongoose.Schema({
    id_text: String,
    id_img: String,
    type: String,
    text: String,
    imgURL: String,
    lat: Number,
    lon: Number,
    //remove: Boolean,
});

// coMpila il modello
const POI = mongoose.model("POI", schema) 

function recuperaPoi(){
    POI.find({}).then((documenti) => {
        console.log('elementi: ',documenti.length);
        data = documenti;
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
            } // ~ swith
        }); // ~ map
        return "ok"
    })
    .catch((err) => console.log("errore durante il recupero dei documenti", err))
}

mongoose.connect(mongodb/*, {useNewUrlParser: true, useUnifiedTopology: true}*/)
    .then(()=>{
        console.log('Connessione a mongoDB con mongoose ok ...');
        // recupera dati
        recuperaPoi(); 
        console.log('avvio il recupero POI ciclico');    
        //globalThis.setInterval(() => recuperaPoi(), 10000); // 
        server.listen(port, () => console.log(`Server running at https://localhost:${port}/\nor https://192.168.1.59:3000/\nverify width ipconfig (IPV4)`));
 
    }).catch(err => console.log("errore durante la connessione a mongoDB", err));

app.get('/', (req, res) =>{
    res.send('<h1>Hello World!!!</h1><h2>By Angelo MIRABELLI</h2>');
});

app.get('/directory', (req, res) => { // `/directory?id=${unicID}&b=val2`
    const {id, b} = req.query; 
    res.status(200).json(data);
    console.log('Send ok -', id, b)
});
    
app.get('/server', (req, res) => {
    res.sendFile('server.html',{root: __dirname +'/'})
})

app.get('/mappa', (req, res) => {
    res.sendFile('map.html',{root: __dirname+'/'})
  })

//server.listen(port, () => console.log(`Server running at https://localhost:${port}/\nor https://192.168.1.59:3000/\nverify width ipconfig (IPV4)`));
    
// Insert the article in our MongoDB database
//await POI.create(data);
//const a = await doc.find();
//console.log(a)


