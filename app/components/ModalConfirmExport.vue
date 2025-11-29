<template>
<div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
        <div class="modal-title">Сохранить изображение?</div>
        
        <div class="preview-container">
            <img :src="previewUrl" alt="Preview" class="preview-image" />
        </div>

        <div class="modal-buttons">
            <button @click="confirmDownload" class="btn">Сохранить</button>
            <button @click="closeModal" class="btn btn-cancel">Отмена</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
const showModal = defineModel<boolean>('showModal')
const previewUrl = defineModel<string>('previewUrl')
const pendingBlob = defineModel<Blob | null>('pendingBlob')

const confirmDownload = () => {
    if (pendingBlob.value) {
      downloadBlob(pendingBlob.value, 'annotated-page.png')
    }
    closeModal()
}

const closeModal = () => {
    showModal.value = false
    // Очищаем URL для освобождения памяти
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    previewUrl.value = ''
    pendingBlob.value = null
}

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-title {
    margin: 0 0 16px 0;
    text-align: center;
    color: var(--primary-color);
    font-weight: 700;
    font-size: 20px;
}

.preview-container {
    margin: 16px 0;
    text-align: center;
    max-height: 400px;
    overflow: hidden;
}

.preview-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.modal-buttons {
    display: grid;
    gap: 8px;
    margin-top: 20px;
}
</style>