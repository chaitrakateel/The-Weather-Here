    //Geo Locate
        //check if geolocation is available on your local
        let lat,lon;
     if('geolocation' in navigator)  {
     console.log('geolocation is available');
    //call the getCurrentPosition function of the geolocation API
    navigator.geolocation.getCurrentPosition( async position => {
      let lat,lon,weather,air;
    try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        document.getElementById("latitude").textContent = lat.toFixed(2);
        document.getElementById("longitude").textContent = lon.toFixed(2);

        //variable holding the lat and lon got from the geolocation api
        const api_url = `weather/${lat},${lon}`;
        //make a fetch request
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);
        const weather = json.weather.currently;
        console.log(weather);
        //variable to hold the airQuality info
        const air = json.airQuality.results[0];
        //console.log(air);
        //posting the summary and the temperature information on to the UI
        document.getElementById("summary").textContent = weather.summary;
        document.getElementById("temperature").textContent = weather.temperature;

    //posting the particle per million data from the airquality api
        document.getElementById("aq_parameter").textContent = air.measurements[0].parameter;
        document.getElementById("aq_value").textContent = air.measurements[0].value;
        document.getElementById("aq_units").textContent = air.measurements[0].unit;
        document.getElementById("aq_city").textContent = air.city;
        document.getElementById("aq_location").textContent = air.location; 
        document.getElementById("aq_date").textContent = air.measurements[0].lastUpdated; 
               //make an object that holds both lat and lon and package this to the server
        const data = { lat, lon, weather, air };
                //fetching the data and sending that to server
                const options = {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                          },
                  body: JSON.stringify(data)
                         };
                      
                  const db_response = await fetch('/api', options);
                  const db_sevResponse = await (db_response.json());
                  console.log(db_sevResponse);


        }
        catch (error)   {
          console.error(error);
          air = { value : -1 };
          document.getElementById('aq_value').textContent = 'NO_READING';
        }


        });
        }
        else  {
                  console.log('geolocation is not available');
              }
    
    

        