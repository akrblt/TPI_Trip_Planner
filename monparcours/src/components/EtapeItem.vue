<template>

    <div class="etape-card">
        <div class="card-header">
            <!-- titre  -->
            <strong> #{{ index }}</strong> - {{ etape.name }}

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

    defineProps(['etape','index']);

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

.comment-section label {
    width: 100%;
    height: 60px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
}

</style>