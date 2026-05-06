<template>

    <div class="etape-card" :style="{borderLeftColor:etape.color}">
        <div class="card-header">
            <!-- titre  -->
            <strong> #{{ index }}</strong> - {{ etape.name }}

        </div>
<!-- Color selection  -->
        <div class="color-selection">
            <span class="label-text">Point color : </span>
            <div class="palette">
                <button
                v-for="color in availableColors"
                :key="color"
                type="button"
                class="color-btn"
                :style="{ backgroundColor: color}"
                :class="{active:etape.color===color}"
                @click="selectColor(color)"
                ></button>
            </div>
        </div>

        <!-- Arrival time-->
         <div class="time-section">
            <label for="arrival-time">Arrival time</label>
            <input 
            id="arrival-time"
            type="time"
            v-model="etape.arrivalTime"
            step="60"
            
            />
            <small class="time-hint">Format: HH:MM</small>
         </div>

        <!-- commentaire  -->
         <div class="comment-section">
            <label for="comment-input">Commentaire</label>
            <textarea
            id="comment-input"
            v-model="etape.comment"
            placeholder="Add a note ... "
            ></textarea>
         </div>
        
    </div>

    </template>

    <script setup>

   const props= defineProps(['etape','index']);
      
    // for send information
const emit=defineEmits(['color-changed']);
    
    // color options
    const availableColors=['#3388ff', '#ff4444', '#44bb44', '#ffbb33', '#aa66cc','#f57627','#f527ad','#27f5f2'];



//When a color is selected, both update the data and notify the user
const selectColor = (color)=> {
    props.etape.color=color;
    emit('color-changed',{id:props.etape.id,
                            color:color}
)}



</script>

<style scoped>

.etape-card {
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 5px solid #3388ff;
}

.card-header {
    margin-bottom: 10px;
    font-size: 1.1em;
}
.color-selection {
    margin-bottom: 15px;
}

.label-text {
    display: block;
    font-size: 0.9em;
    margin-bottom: 8px;
    color: #555;
}

.palette {
    display: flex;
    gap: 10px;
}

.color-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
    cursor: pointer;
    padding: 0;
}

.color-btn.active {
    border: 2px solid #333;
    transform: scale(1.1);

}

.comment-section label {
display: block;
font-size: 0.9em;
margin-bottom: 5px;
}

.comment-section textarea {
    width: 100%;
    height: 60px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
}

.time-section {
    margin-bottom: 15px;
}

.time-section label {
    display: block;
    font-size: 0.9em;
    margin-bottom: 5px;
}

.time-section input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;
}

</style>