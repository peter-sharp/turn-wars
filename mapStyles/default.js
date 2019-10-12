import getTileBorders from './getTileBorders.js';
import fillTile from './fillTile.js';
import getPixelCoords from './getPixelCoords.js';
import length from './length.js';

function defaultStyle({ tileSize, context }) {
    function renderGrass({ column, row }) {
        fillTile(context, 'green', tileSize, { column, row })
        const bladeScale = 10
        const bladeSize = tileSize / bladeScale
        const baseX = column * tileSize
        const baseY = row * tileSize
        for (let c = 0; c < bladeScale; c++) {
            for (let r = 0; r < bladeScale; r++) {
                context.fillStyle = `rgba(255, 255, 255, ${(r + c) % 2 ? 0.1 : 0.2})`;

                const x = baseX + (bladeSize * c)
                const y = baseY + (bladeSize * r)
                context.fillRect(x, y, bladeSize, bladeSize)
            }
        }
    }

    function renderMountains({ column, row }) {
        renderGrass({ column, row })
    }

    function renderWater({ column, row, terrain, tile }) {
        const borders = getTileBorders(terrain, { row, column }, tile)

        fillTile(context, 'blue', tileSize, { column, row })
        const waveScale = 10
        const waveSize = tileSize / waveScale
        const x = column * tileSize
        const baseY = row * tileSize
        for (let r = 0; r < waveScale; r++) {
            context.fillStyle = `rgba(255, 255, 255, ${r % 2 ? 0.08 : 0})`;

            const y = baseY + (waveSize * r)
            context.fillRect(x, y, tileSize, waveSize)

        }
        if (length(borders)) {
            const aboveWater = tileSize / 8
            const belowWater = tileSize / 10
            if ('up' in borders && tile === 1) {
                const { x, y } = getPixelCoords(tileSize, { column, row })
                context.fillStyle = 'rgb(0, 50, 20)'
                context.fillRect(x, y, tileSize, aboveWater)
                context.fillStyle = 'rgba(0, 50, 20, 0.3)'
                context.fillRect(x, y + aboveWater, tileSize, belowWater)
            }
        }
    }


    return {
        tiles: [renderGrass, renderWater]
    }
}


export default defaultStyle