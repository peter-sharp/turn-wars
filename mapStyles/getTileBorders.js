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
import board from '/board/index.js'
const notEqual = complement(equals)

const getPairValue = compose(prop(1))
const valueNotUndefined = compose(notEqual(undefined), getPairValue)
function getTileBorders(terrain, coord, tile) {
    const tiles = board.getAdjacentTiles(terrain, coord);
    const valueNotTile = compose(notEqual(tile), getPairValue)
    const differentTiles = compose(filter(valueNotTile), filter(valueNotUndefined))
    return fromPairs(transduce(differentTiles, flip(append), [], toPairs(tiles)))
}

export default getTileBorders