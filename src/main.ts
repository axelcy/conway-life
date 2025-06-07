import { draw, toggleCell } from './render'
import { tick } from './game'

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

// Objeto cámara para manejar el desplazamiento y zoom
const camera = {
    offsetX: 0, // delta x
    offsetY: 0, // delta y
    isPanning: false, // el mouse está siendo presionado para arrastrar
    startPanX: 0, // x inicial
    startPanY: 0, // y inicial
    scale: 100
}

let isPlaying: boolean = false
let intervalId: number | undefined = undefined

export const getCoords = (cell: string): [number, number] => cell.split(',').map(Number) as [number, number]
export const getCell = ([x, y]: [number, number]): string => `${x},${y}`

const state = {
    alive: new Set<string>(),
    width: window.innerWidth,
    height: window.innerHeight
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

draw(state.alive, ctx, camera)

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw(state.alive, ctx, camera)
    console.log(state.alive)
})

// Manejar zoom con la rueda del mouse cambiando camera.scale
canvas.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    const zoomFactor = 1.1
    if (e.deltaY < 0) camera.scale *= zoomFactor
    else camera.scale /= zoomFactor
    camera.scale = Math.max(10, Math.min(500, camera.scale))
    draw(state.alive, ctx, camera)
}, { passive: false }) // { passive: false } para evitar el scroll de la página

let panTimeout: number | undefined = undefined
let wasPanning = false

canvas.addEventListener('mousedown', (e: MouseEvent) => {
    camera.isPanning = false
    wasPanning = false
    panTimeout = window.setTimeout(() => {
        camera.isPanning = true
        wasPanning = true
    }, 120) // 120ms para distinguir click de arrastre
    
    camera.startPanX = e.clientX - camera.offsetX
    camera.startPanY = e.clientY - camera.offsetY
})
window.addEventListener('mousemove', (e: MouseEvent) => {
    if (!camera.isPanning) return
    camera.offsetX = e.clientX - camera.startPanX
    camera.offsetY = e.clientY - camera.startPanY
    draw(state.alive, ctx, camera)
})

window.addEventListener('mouseup', () => {
    if (panTimeout) {
        clearTimeout(panTimeout)
        panTimeout = undefined
    }
    camera.isPanning = false
})

canvas.addEventListener('click', (e: MouseEvent) => {
    if (isPlaying || camera.isPanning || wasPanning) return
    const rect = canvas.getBoundingClientRect()
    const { offsetX, offsetY, scale } = camera
    const x = Math.floor((e.clientX - rect.left - offsetX) / scale)
    const y = Math.floor((e.clientY - rect.top - offsetY) / scale)
    state.alive = toggleCell(x, y, state.alive)
    draw(state.alive, ctx, camera)
})

const playButton = document.getElementById('play') as HTMLButtonElement
playButton.addEventListener('click', () => {
    isPlaying = !isPlaying
    playButton.innerHTML = isPlaying ? 'Pause' : 'Play'
    if (!isPlaying && intervalId) {
        clearInterval(intervalId)
        intervalId = undefined
        return
    }
    intervalId = setInterval(() => {
        state.alive = tick(state.alive)
        draw(state.alive, ctx, camera)
    }, 500)
})

document.getElementById('reset')?.addEventListener('click', () => {
    isPlaying = false
    clearInterval(intervalId)
    state.alive.clear()
    draw(state.alive, ctx, camera)
})