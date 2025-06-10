// @ts-ignore
import GIF from 'gif.js.optimized'
import { config } from '../config'
// importar el archivo de public/loading.svg
import loadingSvg from './assets/loading.svg'

const exportButton = document.getElementById('export') as HTMLButtonElement
const exportButtonText = 'Export'

export function exportCanvasToGif(canvas: HTMLCanvasElement, drawFrame: () => void) {
    exportButton.disabled = true
    exportButton.style.cursor = 'wait'

    const gif = new GIF({
        workers: 2, // hilos del procesador para capturar los frames
        quality: 10, // calidad del numero 1 al 100
        width: canvas.width,
        height: canvas.height,
        workerScript: 'node_modules/gif.js.optimized/dist/gif.worker.js',
    })
    gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'export.gif'
        a.click()
        exportButton.disabled = false
        exportButton.innerHTML = exportButtonText
        exportButton.style.cursor = 'pointer'
        URL.revokeObjectURL(url) // para sacar la url del blob y liberar memoria
    })
    let frameCount = 0
    capture()

    function capture() {
        drawFrame()
        gif.addFrame(canvas, { copy: true, delay: 200 })
        frameCount++
        exportButton.innerHTML = `Capturing frame ${frameCountWithCeros(frameCount)}/${frameCountWithCeros(config.maxExportFrames)}`
        if (frameCount < config.maxExportFrames) requestAnimationFrame(capture)
        else {
            gif.render()
            exportButton.innerHTML = `
                <div class="export-btn-loading">
                    <img src="${loadingSvg}" alt="Loading..." style="width: 25px; height: 25px;">
                    <span>Making GIF...</span>
                </div>
            `
        }
    }
}

const frameCountWithCeros = (count: number): string => {
    const maxDigits = config.maxExportFrames.toString().length
    return count.toString().padStart(maxDigits, '0')
}