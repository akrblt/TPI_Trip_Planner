<template>
    <div class="map-wrap">
        <!-- a simple button for my location -->
         <button @click="findMyLocation" class="btn-location">My Position</button>
    </div>
<!-- create map in div -->
<div id="map" style="height: 100vh; width: 100%;"  ></div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import L from 'leaflet';

// define map  , everyone can see it
const myMap=ref(null);

onMounted(()=>{

    // When the app opens, the map of Lausanne will appear
    myMap.value=L.map('map').setView([46.7826,6.6449],13) // yverdon

    // z: zoom  x and y : Coordinate squares
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'© OpenStreetMap contributors'
    }).addTo(myMap.value);
})

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

.map-wrap {
    position: relative;

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

