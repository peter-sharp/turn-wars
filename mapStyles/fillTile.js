import getPixelCoords from './getPixelCoords.js'

function fillTile(context, style, tileSize, { column, row }) {
    context.fillStyle = style;

    const { x, y } = getPixelCoords(tileSize, { column, row })
    context.fillRect(x, y, tileSize, tileSize)
}

export default fillTile