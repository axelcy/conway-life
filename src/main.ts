import { draw, toggleCell } from './render'
import { tick } from './game'
import { config } from '../config'

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

// para manejar zoom y movimiento
const camera = {
    offsetX: 0, // delta x
    offsetY: 0, // delta y
    isDragging: false,
    startDragX: 0, // x inicial
    startDragY: 0, // y inicial
    scale: config.initialScale
}

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



// #================= functions =================# 

function getXYfromEvent(e: MouseEvent): { x: number, y: number } {
    const rect = canvas.getBoundingClientRect() // coordenadas del canvas
    const { offsetX, offsetY, scale } = camera
    const x = Math.floor((e.clientX - rect.left - offsetX) / scale)
    const y = Math.floor((e.clientY - rect.top - offsetY) / scale)
    return { x, y }
}



// #================= events =================#

let isPlaying: boolean = false
let isDrawing: boolean = false
let isErasing: boolean = false
let tickIntervalId: number | undefined = undefined

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw(state.alive, ctx, camera)
})

// zoom con la rueda del mouse
canvas.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) camera.scale *= config.zoomFactor
    else camera.scale /= config.zoomFactor
    camera.scale = Math.max(config.minScale, Math.min(config.maxScale, camera.scale))
    draw(state.alive, ctx, camera)
}, { passive: false }) // { passive: false } para evitar el scroll de la página

// comenzar desplazamiento con ruedita
canvas.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault()
    // ruedita
    if (e.button === 1) {
        camera.isDragging = true
        camera.startDragX = e.clientX - camera.offsetX
        camera.startDragY = e.clientY - camera.offsetY
    }

    // click izq
    else if (!isPlaying && e.button === 0) {
        isDrawing = true
        const { x, y } = getXYfromEvent(e)
        if (state.alive.has(getCell([x, y]))) isErasing = true
        isErasing ? state.alive.delete(getCell([x, y])) : state.alive.add(getCell([x, y]))
        draw(state.alive, ctx, camera)
    }
})
window.addEventListener('mousemove', (e: MouseEvent) => {
    if (isDrawing && !isPlaying) {
        const { x, y } = getXYfromEvent(e)
        // state.alive.add(getCell([x, y]))
        isErasing ? state.alive.delete(getCell([x, y])) : state.alive.add(getCell([x, y]))
        draw(state.alive, ctx, camera)
    }
    else if (camera.isDragging) {
        camera.offsetX = e.clientX - camera.startDragX
        camera.offsetY = e.clientY - camera.startDragY
        draw(state.alive, ctx, camera)
    }
})
window.addEventListener('mouseup', (e: MouseEvent) => {
    camera.isDragging = false
    isDrawing = false
    isErasing = false
})



// #================= buttons =================#

const playButton = document.getElementById('play') as HTMLButtonElement
playButton.addEventListener('click', () => {
    isPlaying = !isPlaying
    playButton.innerHTML = isPlaying ? 'Pause' : 'Play'
    if (!isPlaying && tickIntervalId) {
        clearInterval(tickIntervalId)
        tickIntervalId = undefined
        return
    }
    tickIntervalId = setInterval(() => {
        state.alive = tick(state.alive)
        draw(state.alive, ctx, camera)
    }, 500)
})

document.getElementById('reset')?.addEventListener('click', () => {
    isPlaying = false
    clearInterval(tickIntervalId)
    state.alive.clear()
    draw(state.alive, ctx, camera)
})