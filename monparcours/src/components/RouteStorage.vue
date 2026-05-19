<template>
    <!-- Storage panel with Save and Load buttons -->
<div class="storage-panel">
    <button @click="saveRoute">Save</button>
    <button @click="loadRoute">Load</button>
</div>


</template>

<script setup> 
// Receive etapes array from parent component
const props=defineProps({
    etapes:Array
});

const emit=defineEmits([
    "load-route"
]);
// Save route into LocalStorage
const saveRoute=()=>{
    // Check if there are points to save
    if(!props.etapes || props.etapes.length ===0){
        // Show alert if route is empty
        return alert("Nothing to save! Please add some points first") 
    }
    // Convert route data into JSON and store it
    localStorage.setItem("myRoute",JSON.stringify(props.etapes));
     // Confirmation message
    alert("Saved!");
};
// Load route from LocalStorage
const loadRoute=()=>{
    const data=localStorage.getItem("myRoute");
    if(!data || data === "[]") {
        // Show alert if no route exists
        return alert("No route found in storage!");

    } 
    try {
        // Convert JSON string back into JavaScript object
        const parsedData=JSON.parse(data);

         // Send loaded data to parent component
        //emit("load-route",JSON.parse(data));
        emit("load-route",parsedData);

    } catch (e) {
        // Error handling if JSON parsing fails
        alert("Error parsing stored data.")
        // Display error in console
        console.error(e);
    }
    
}

</script>