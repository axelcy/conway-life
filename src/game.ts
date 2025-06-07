import { getCell, getCoords } from './main'

function getNeighbors(x: number, y: number): [number, number][] {
    const neighbors: [number, number][] = []
    for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
            if (dx === 0 && dy === 0) continue // omitir la celda misma
            neighbors.push([x + dx, y + dy])
        }
    }
    return neighbors
}

export function tick(alive: Set<string>): Set<string> {
    const nextAlive = new Set<string>()

    for (const cell of alive) {
        const [x, y]: [number, number] = getCoords(cell)
        const neighbors: [number, number][] = getNeighbors(x, y)
        const aliveNeighbors: [number, number][] = neighbors.filter(n => alive.has(getCell(n)))

        // si tiene 2 o 3 vecinos, sigue viva
        if ([2, 3].includes(aliveNeighbors.length)) nextAlive.add(cell)
            
        // si una celda tiene exactamente 3 vecinos vivos, revive
        for (const neighbor of neighbors) {
            if (alive.has(getCell(neighbor))) continue
            const [nx, ny] = neighbor
            const has3AliveNeighbors = getNeighbors(nx, ny).filter(n => alive.has(getCell(n))).length === 3
            if (has3AliveNeighbors) nextAlive.add(getCell([nx, ny]))
        }
    }

    return nextAlive
}