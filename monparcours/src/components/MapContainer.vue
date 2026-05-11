<template>
    <div class="main-layout">
    <div class="map-wrap">
        <!-- a simple button for my location -->
         <button @click="findMyLocation" class="btn-location">My Position</button>
         <button @click="drawRoute" class="btn-route">
            Draw Lines
         </button>

    
<!-- create map in div -->
<div id="map" style="height: 100vh; width: 100%;"  >

</div>
</div>
<Sidebar :etapes="etapes" 
@color-changed="updateMarkerColor"
@load-route="loadRoute"
  />

</div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import L from 'leaflet';
import Sidebar from './Sidebar.vue';



// define map  , everyone can see it
const myMap=ref(null);
const etapes=ref([]); // every etape save in 

const markerObjects=ref({}) //creating an object to track the markers

const routeLine=ref(null);


onMounted(()=>{

    // When the app opens, the map of yverdon will appear
    myMap.value=L.map('map').setView([46.7826,6.6449],13) // yverdon

    // z: zoom  x and y : Coordinate squares
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'© OpenStreetMap contributors'
    }).addTo(myMap.value);

    // when onclick , new points add
myMap.value.on('click',(e)=>{
    const newEtape={
        id:Date.now(),
        lat: e.latlng.lat,
        lng:e.latlng.lng,
        name: "Point "+ (etapes.value.length+1),
        comment: "" ,// for commentaire
        color:'#4595fc',
        arrivalTime:'',
        order:etapes.value.length+1
    };
    etapes.value.push(newEtape);

    const number=newEtape.order
    

    //  use `circleMarker` when creating markers because it’s easier to change its color
    const marker= L.circleMarker([e.latlng.lat,e.latlng.lng],{
        radius:15,
        fillColor: newEtape.color,
        color:"#fff",
        weight:2,
        opacity:1,
        fillOpacity:0.9,
        fill:true
        
    })
     .addTo(myMap.value)
    .bindPopup(`Point ${number}`)
    .bindTooltip(`${number}`, {
    permanent: true,
    direction: 'top',
    
    className: 'number-label'
    });
    

    //on map
   // L.marker([e.latlng.lat,e.latlng.lng])
   

    // marker save with id in MarkerObject
    markerObjects.value[newEtape.id]=marker
   // console.log("Point created ",newEtape)
  //  console.log("Marker created",marker)
});
});







// updating the color using Leaflet's built-in function
const updateMarkerColor = (data) =>{
    const marker= markerObjects.value[data.id];
    if (marker) {
        marker.setStyle({
            fillColor:data.color,
            color:data.color
        });
        marker.redraw();
    }
}
    

    

// function for find user'ss location
const findMyLocation =()=>{
    // check => browser supports geolocalisation
    if (!navigator.geolocation){
        alert("Ouups , your browser doen not support geolocalisation ");
        return;
    }

    // ask ==> permission and get position
    navigator.geolocation.getCurrentPosition(
        (position)=>{
            const lat=position.coords.latitude;
            const lng=position.coords.longitude;
            // move map to users loca and add a markerr
            if(myMap.value){
                   myMap.value.setView([lat,lng],15);
            L.marker([lat,lng])
            .addTo(myMap.value)
            .bindPopup(" You are here !!!")
            .openPopup();
        }

            },
         
    (error)=>{
        // if user click no , show yverdon 
        console.log("User refused location. Staying in Yverdon");
        // if error, i go yverdon
        if(myMap.value){
             myMap.value.setView([46.7826,6.6449],13);

        }
       
        alert("Location denied. Showing Yverdon Les Bains")
    }
    );
}

const drawRoute=()=>{
    if(!myMap.value) return;

    //remove old line if exists
    if(routeLine.value){
        myMap.value.removeLayer(routeLine.value)
    }

    // gel all coordinatees
    const points =etapes.value.map(p=> [p.lat,p.lng]);
    //need at least 2 points
    if (points.length < 2){
        alert("Add at least 2 points");
        return;
    }
    //draw line
    routeLine.value=L.polyline(points,{
        color:'black',
        weight:2.5
    }).addTo(myMap.value);
};

// load route
const loadRoute = (data) => {

    etapes.value = data;

    // remove old markers
    Object.values(markerObjects.value).forEach(m => {
        myMap.value.removeLayer(m);
    });

    markerObjects.value = {};

    // redraw markers
    etapes.value.forEach((etape, index) => {

        const marker = L.circleMarker([etape.lat, etape.lng], {
            radius: 15,
            fillColor: etape.color,
            color: "#fff",
            weight: 2,
            fillOpacity: 0.9
        })
        .addTo(myMap.value)
        .bindPopup(`Point ${index + 1}`)
        .bindTooltip(`${index + 1}`, {
            permanent: true,
            direction: 'top',
            className: 'number-label'
        });

        markerObjects.value[etape.id] = marker;
    });

};



</script>

<style scoped>

.main-layout {
    display: flex;
    height: 100vh;
    width: 100%;
}

.map-wrap {
    position: relative;
    flex-grow: 1;

}

.btn-location {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1000;
    padding: 10px;
    background-color: wheat;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
}

.btn-route {
    position: absolute;
    top: 60px;
    right: 15px;
    z-index: 1000;
    padding: 10px;
    background-color: lightgreen;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
}






</style>

