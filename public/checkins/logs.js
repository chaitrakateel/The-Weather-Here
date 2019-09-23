//making the map and tiles using leaflet.js
const mymap = L.map('issMap').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(mymap);

getData();
async function getData()  {
  const response = await fetch('/api');
  const dbResponse = await response.json();

  for(item of dbResponse)   {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here at ${item.lat}&deg;,  
    ${item.lon}&deg; is ${item.weather.summary}with a temperature of ${item.weather.temperature}&deg; C`;

    if(item.air.measurements[0].value < 0)  {
      txt += ' No air quality reading';
    }
    else {
    txt += `The concentration of small carcinogenic particles(${item.air.measurements[0].parameter}) I'm breathing in is 
    ${item.air.measurements[0].value} ${item.air.measurements[0].unit} measured from 
    ${item.air.city} and 
    ${item.air.location} on ${item.air.measurements[0].lastUpdated}`;
    }

    marker.bindPopup(txt);
  
  }
  console.log(dbResponse);
}

/*   for(item of dbResponse)   {
  const root = document.createElement('div');
  const geo = document.createElement('p');
  const date = document.createElement('p');

  geo.textContent = `${item.lat}, ${item.lon}`;
  const dateString = new Date(item.timestamp).toLocaleString();
  date.textContent = dateString;
  root.append(geo,date);
  document.body.append(root);
  }
  console.log(dbResponse);
} */


