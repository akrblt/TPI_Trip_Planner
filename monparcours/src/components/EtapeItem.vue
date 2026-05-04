<template>

    <div class="etape-card">
        <strong> #{{ index }}</strong> - {{ etape.name }}
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

</style>