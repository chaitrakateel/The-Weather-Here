const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();



const app = express();
app.listen('3000', () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit : '1mb'}));

const database2 = new Datastore('geolocate.db');
database2.loadDatabase();

//get data from databse
app.get('/api', (request,response) =>   {
  database2.find({}, (err,data) =>  {
    if(err)   {
      response.end();
      return;
    }
    response.json(data);
  });
});

//Send the lat and lon inforation to server
app.post('/api', (request,response) =>  {
  console.log('I gotta request');
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database2.insert(data);
  response.json(data);
});

    //make an end point here on the server side code that receives lat and lon from geolocation api
    //and then makes a call to the darksky api to fetch the weather info
    //variable holding the lat and lon got from the geolocation api
    app.get('/weather/:latlon',async(request,response) =>  {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
    //make a fetch request
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    //make a fetch request
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    //make an object that holds data of the two fetch api requests
    const all = {
      weather: weather_data,
      airQuality : aq_data
    };
    
    response.json(all);
  });




/*https://api.openaq.org/v1/latest?coordinates=12.90,77.59*/