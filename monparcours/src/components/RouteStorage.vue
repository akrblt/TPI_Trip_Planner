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
    if(!props.etapes || props.etapes.length ===0){
        return alert("Nothing to save! Please add some points first") 
    }
    localStorage.setItem("myRoute",JSON.stringify(props.etapes));
    alert("Saved!");
};

const loadRoute=()=>{
    const data=localStorage.getItem("myRoute");
    if(!data || data === "[]") {
        return alert("No route found in storage!");

    } 
    try {
        const parsedData=JSON.parse(data);
        emit("load-route",JSON.parse(data));

    } catch (e) {
        alert("Error parsing stored data.")
        console.error(e);
    }
    
}

</script>