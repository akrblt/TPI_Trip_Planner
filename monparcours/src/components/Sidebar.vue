<template>
    <div class="sidebar">
        <!-- Sidebar title -->
        <h3>My etapes</h3>

        <!-- Storage buttons component (Save / Load) -->
        <div class="btn-storage">
    <RouteStorage
:etapes="etapes"
@load-route="$emit('load-route',$event)"
/>
</div>    <!-- Message displayed when there are no points -->
        <div v-if="etapes.length === 0" class="empty-msg">
            No points added. Click on the map!
        </div>
         <!-- Loop through all etapes and display each item -->
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
import RouteStorage from './RouteStorage.vue';
// Receive props from parent
defineProps(['etapes'])
// Define emitted events
defineEmits(['color-changed','load-route'])



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

.btn-storage {
   margin-top: 10px;
   margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}


</style>