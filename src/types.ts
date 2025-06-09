export interface Camera {
    offsetX: number // delta x
    offsetY: number // delta y
    isDragging: boolean
    startDragX: number // x inicial
    startDragY: number // y inicial
    scale: number // escala del canvas
}