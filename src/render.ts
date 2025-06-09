import { getCell, getCoords } from './main'
import type { Camera } from './types'

export function draw(alive: Set<string>, ctx: CanvasRenderingContext2D, camera: Camera): void {
    const { scale, offsetX, offsetY } = camera

    // limpiar el canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // fondo negro
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    drawGrid(ctx, camera) // cuadrícula con opacidad dinámica

    ctx.save()
    ctx.translate(offsetX, offsetY) // desplazar el canvas

    // dibujar las celdas vivas
    ctx.fillStyle = 'white'
    for (const cell of alive) {
        const [x, y] = getCoords(cell)
        ctx.fillRect(x * scale, y * scale, scale, scale)
    }
    ctx.restore()
}

// no se usa
// export function toggleCell(x: number, y: number, alive: Set<string>): Set<string> {
//     const cell: string = getCell([x, y])
//     alive.has(cell) ? alive.delete(cell) : alive.add(cell)
//     return alive
// }

function drawGrid(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const { scale, offsetX, offsetY } = camera
    const { width, height } = ctx.canvas

    ctx.save()
    // empezar dibujando la cuadrícula desde arriba a la izquierda
    ctx.translate(offsetX % scale, offsetY % scale)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()

    const extraLines = 2

    // líneas verticales
    for (let x = -extraLines; x <= width / scale + extraLines; x++) {
        const px = x * scale
        ctx.moveTo(px, 0)
        ctx.lineTo(px, height)
    }

    // líneas horizontales
    for (let y = -extraLines; y <= height / scale + extraLines; y++) {
        const py = y * scale
        ctx.moveTo(0, py)
        ctx.lineTo(width, py)
    }

    ctx.stroke()
    ctx.restore()
}
