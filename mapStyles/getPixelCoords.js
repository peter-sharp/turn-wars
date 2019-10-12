function getPixelCoords(tileSize, { column, row }) {
    return {
        x: column * tileSize,
        y: row * tileSize
    }
}

export default getPixelCoords