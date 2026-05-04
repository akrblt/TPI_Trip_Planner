<template>
    <div class="main-layout">
    <div class="map-wrap">
        <!-- a simple button for my location -->
         <button @click="findMyLocation" class="btn-location">My Position</button>
    
<!-- create map in div -->
<div id="map" style="height: 100vh; width: 100%;"  >

</div>
</div>
<Sidebar :etapes="etapes" />
</div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import L from 'leaflet';
import Sidebar from './Sidebar.vue';

// define map  , everyone can see it
const myMap=ref(null);
const etapes=ref([]); // every etape save in 

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
        name: "Point "+ (etapes.value.length+1)
    };
    etapes.value.push(newEtape);

    //on map
    L.marker([e.latlng.lat,e.latlng.lng])
    .addTo(myMap.value)
    .bindPopup(newEtape.name)
});
});



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




</style>

