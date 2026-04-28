<template>

<div id="map" style="height: 100vh; width: 100%;"  ></div>
</template>

<script setup>

import { onMounted } from 'vue';
import L from 'leaflet';

onMounted(()=>{

    // When the app opens, the map of Lausanne will appear
    const map=L.map('map').setView([46.7826,6.6449],13) // yverdon

    // z: zoom  x and y : Coordinate squares
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'© OpenStreetMap contributors'
    }).addTo(map);
})

</script>


