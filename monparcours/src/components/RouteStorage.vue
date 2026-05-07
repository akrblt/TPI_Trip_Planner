<template>
<div class="storage-panel">
    <button @click="saveRoute">Save</button>
    <button @click="loadRoute">Load</button>
</div>


</template>

<script setup> 
const props=defineProps({
    etapes:Array
});

const emit=defineEmits([
    "load-route"
]);

const saveRoute=()=>{
    localStorage.setItem("myRoute",JSON.stringify(props.etapes));
    alert("Saved!");
};

const loadRoute=()=>{
    const data=localStorage.getItem("myRoute");
    if(!data) return alert("No route");
    emit("load-route",JSON.parse(data))
}

</script>