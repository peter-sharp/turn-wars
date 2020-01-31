import inBounds from './inBounds.js'

function getTile({ tiles, columns, rows }, { column, row }) {
    return inBounds({ rows, columns }, { row, column }) ? tiles[row * columns + column] : undefined
}

export default getTile
