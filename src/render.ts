import { getCell, getCoords } from './main'

export function draw(alive: Set<string>, ctx: CanvasRenderingContext2D, { scale, offsetX, offsetY }: { scale: number, offsetX: number, offsetY: number }): void {
    // limpiar el canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // fondo negro
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // aplicar pan (desplazamiento)
    ctx.save()
    ctx.translate(offsetX, offsetY) // desplazar el canvas
    // dibujar las celdas vivas
    ctx.fillStyle = 'white'
    for (const cell of alive) {
        const [x, y] = getCoords(cell)
        ctx.fillRect(x * scale, y * scale, scale, scale)
    }
    ctx.restore()

    // que el canvas tenga un borde rojo (dev only)
    // ctx.strokeStyle = 'red'
    // ctx.lineWidth = 2
    // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function toggleCell(x: number, y: number, alive: Set<string>): Set<string> {
    const cell: string = getCell([x, y])
    alive.has(cell) ? alive.delete(cell) : alive.add(cell)
    return alive
}