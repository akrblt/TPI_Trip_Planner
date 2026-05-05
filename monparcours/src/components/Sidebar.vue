<template>
    <div class="sidebar">
        <h3>My etapes</h3>
        <div v-if="etapes.length === 0" class="empty-msg">
            No points added. Click on the map!
        </div>

        <EtapeItem
        v-for="(point,index) in etapes"
        :key="point.id"
        :etape="point"
        :index="index+1"
        @color-changed="(data)=>$emit('color-changed',data)"


        />



    </div>

    </template>


<script setup>

//import { point } from 'leaflet';
import EtapeItem from './EtapeItem.vue';
defineProps(['etapes'])



</script>

<style scoped>
.sidebar {
    width: 300px;
    background: #f4f4f4;
    border-left: 1px solid #ddd;
    padding: 15px;
    overflow-y:auto ;

}

.empty-msg {
    color: #888;
    font-style: italic;
    margin-top: 20px;
}

</style>