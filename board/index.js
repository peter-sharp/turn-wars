import inBounds from '../inBounds.js';
import { randomPick } from "../random.js";

board.initialState = {
    terrain: {
        grass: 0,
        water: 1
    },
    layers: [
        {
            type: 'tiles',
            tiles: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ]
        },
        {
            type: 'objects',
            objects: []
        }
    ],
    columns: 10,
    rows: 10,
}

function updateLayers(state = initialState.layers, action, dimensions) {
    console.log(action)
    const { data = {} } = action
    const { layer = null } = data
    switch (action.type) {
        case 'REGENERATE_TILES':
            state[layer] = Object.assign(state[layer], {
                tiles: state[layer].tiles.map(() => randomPick([1, 0, 0]))
            })
            return state
        case 'ADD_ACTOR_TO_BOARD':
            state[layer] = Object.assign({}, state[layer], { objects: [...state[layer].objects, data] })
            return state
        default:
            return state
    }
}

function board(state = initialState, action ) {
    
    const { rows, columns } = state
    return {
        layers: updateLayers(state.layers, action, { rows, columns }),
        columns,
        rows
    }

}

function getTile({ tiles, columns, rows }, { column, row }) {
    return inBounds({ rows, columns }, { row, column }) ? tiles[row * columns + column] : undefined
}


function getAdjacentTiles(terrain, coord) {
  return map(partial(getAdjacentTile, [terrain, coord]), {
    left: "left",
    right: "right",
    up: "up",
    down: "down"
  });
}

function getAdjacentTile(terrain, { row, column }, direction) {
  switch (direction) {
    case "left":
      column -= 1;
      break;
    case "right":
      column += 1;
      break;
    case "up":
      row -= 1;
      break;
    case "down":
      row += 1;
      break;
  }

  return getTile(terrain, { row, column });
}

board.getTile = getTile

board.reduce = board
board.getAdjacentTiles = getAdjacentTiles
board.getAdjacentTile = getAdjacentTile
export default board