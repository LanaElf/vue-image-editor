<template>
    <div v-show="error" class="error">
        <div>{{ error }}</div>
        <button @click="error = ''" class="btn">Ясно</button>
    </div>
</template>

<script setup lang="ts">
const error = defineModel<string>()
</script>

<style>
.error {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 8px;
    padding: 1em;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: grid;
    gap: 1em;
    justify-items: center;
}

.error .btn {
    width: max-content;
}
</style>