import {
    filter,
    compose,
    equals,
    complement,
    transduce,
    flip,
    append,
    prop,
    fromPairs,
    toPairs,
    partial
} from '/web_modules/ramda.js'

import map from './map.js'

import getTile from '/getTile.js'

const notEqual = complement(equals)

const getPairValue = compose(prop(1))
const valueNotUndefined = compose(notEqual(undefined), getPairValue)
function getTileBorders(terrain, coord, tile) {
    const tiles = getAdjacentTiles(terrain, coord)
    const valueNotTile = compose(notEqual(tile), getPairValue)
    const differentTiles = compose(filter(valueNotTile), filter(valueNotUndefined))
    return fromPairs(transduce(differentTiles, flip(append), [], toPairs(tiles)))
}


function getAdjacentTiles(terrain, coord) {
    return map(
        partial(getAdjacentTile, [terrain, coord]),
        {
            left: 'left',
            right: 'right',
            up: 'up',
            down: 'down'
        }
    )
}

function getAdjacentTile(terrain, { row, column }, direction) {
    switch (direction) {
        case 'left':
            column -= 1
            break;
        case 'right':
            column += 1
            break;
        case 'up':
            row -= 1
            break;
        case 'down':
            row += 1
            break;
    }

    return getTile(terrain, { row, column });
}

export default getTileBorders