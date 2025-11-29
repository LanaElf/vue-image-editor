<!-- pages/index.vue -->
<template>
  <div class="app-container">
    <header class="header">
        <h1>PDF‑редактор</h1> 

        <label class="btn">
            Выбрать PDF
            <input
              type="file"
              accept="application/pdf"
              @change="onFileChange"
              hidden
            />
        </label>

        <a href="https://t.me/elf_lana" target="_blank" class="tg-link">@elf_lana</a>
    </header>

    <div class="main">
        <div v-show="!pdfDocInternal" class="placeholder">
            Пожалуйста, выберите PDF‑документ для просмотра и редактирования.
        </div>

        <div class="toolbar">
            <template v-if="numPages > 0">
                <div class="pages-controls">
                  <button class="btn" @click="prevPage" :disabled="currentPage <= 1">
                    Назад
                  </button>

                  <span class="page-info">
                    Страница: {{ currentPage }} / {{ numPages }}
                  </span>

                  <button class="btn" @click="nextPage" :disabled="currentPage >= numPages">
                    Вперед
                  </button>
                </div>
            </template>
        </div>

        <div class="editor-layout" v-if="pdfLoaded">
          <div class="pdf-container">
            <canvas ref="pdfCanvas"></canvas>
          </div>

          <div class="pintura-container">
            <PinturaExploiter :imageSrc="currentImageSrc" />
          </div>
        </div>

        <ErrorPopup v-model="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick  } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api'

// pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs'

let pdfDocInternal: PDFDocumentProxy | null = null

const currentPage = ref(1)
const numPages = ref(0)
const pdfLoaded = ref(false)
const pdfCanvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')

const currentImageSrc = ref<string | null>(null)

// загрузка файла
const onFileChange = async (e: Event) => {
  error.value = ''

  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (file.type !== 'application/pdf') {
    error.value = 'Допустим только файл формата PDF.'
    return
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })

    pdfDocInternal = await loadingTask.promise
    numPages.value = pdfDocInternal.numPages
    currentPage.value = 1
    pdfLoaded.value = true

    await nextTick()
    await renderCurrentPage()
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при чтении PDF‑файла.'
  } finally {
    input.value = ''
  }
}

// рендер текущей страницы в canvas и конвертация в изображение для Pintura
const renderCurrentPage = async () => {
    error.value = ''

    if (!pdfDocInternal) {
        error.value = 'Документ не найден'
        return
    } 
    
    if (!pdfCanvas.value) {
        error.value = 'pdfCanvas не найден'
        return
    }

    try {
        const page: PDFPageProxy = await pdfDocInternal.getPage(currentPage.value)
        
        //scale позволяет увеличить разрешение
        const scale = 3
        const viewport = page.getViewport({ scale: scale })
        const canvas = pdfCanvas.value
        const context = canvas.getContext('2d')
        
        if (!context) return
        
        canvas.height = viewport.height
        canvas.width = viewport.width
        canvas.style.width = (viewport.width / scale) + "px"
        canvas.style.height = (viewport.height / scale) + "px"
        
        const renderContext = {
            canvasContext: context,
            viewport,
            canvas
        }
      
        await page.render(renderContext).promise
        
        const dataUrl = canvas.toDataURL('image/png') //base64‑изображение страницы
        currentImageSrc.value = dataUrl
    } catch (err) {
        console.error(err)
        error.value = 'Ошибка при рендеринге страницы.'
    }
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  await renderCurrentPage()
}

const nextPage = async () => {
  if (!pdfDocInternal || currentPage.value >= pdfDocInternal.numPages) return
  currentPage.value++
  await renderCurrentPage()
}
</script>

<style scoped>
.app-container {
  margin: 0 auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
}

h1 {
  font-size: 24px;
  margin: 0;
}

a {
    text-decoration: none;
    color: #fff;
    font-weight: 600;
}

a:hover {
    text-shadow: 0 0 6px  #fff;
    transition: 0.3s;
}

.header {
    height: 70px;
    padding-inline: 1.5em;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    background-image: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: #fff;
}

.header .btn {
    background-color: #fff;
    color: var(--primary-color);
    font-weight: 800;
}

.header .btn:hover {
    color: var(--secondary-color);
}

.tg-link {
    display: flex;
    justify-content: end;
}

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 70px);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 16px;
  justify-content: space-between;
}

.pages-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.page-info {
  font-size: 14px;
}

.error {
  color: var(--warning-color);
  margin-bottom: 12px;
}

.editor-layout {
  display: grid;
}

.pdf-container canvas {
  width: 100%;
  height: 100%;
  display: none;
}

.pintura-container {
  box-sizing: border-box;
  width: calc(100vw - 52px);
}

.placeholder {
  margin: 24px;
  font-size: 16px;
  color: #666;
  text-align: center;
}

@media(max-width: 575px) {
    .header {
        grid-template-columns: 1fr auto;
    }
    .tg-link {
        display: none;
    }
    .pintura-container {
        width: 100vw;
    }
    .editor-layout {
        padding: 0;
    }
    .main {
        min-height: calc(100vh - 70px);
    }
}
</style>
