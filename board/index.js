import inBounds from '../inBounds.js';
import { randomPick } from "../random.js";
import { path, map, partial } from "/web_modules/ramda.js";

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
    const { data = {} } = action
    const { layer = null } = data
    switch (action.type) {
        case 'REGENERATE_TILES':
            state = state.map((x, i) =>
              i === layer
                ? Object.assign(
                    {},
                    x,
                    {
                      tiles: state[layer].tiles.map(() =>
                        randomPick([1, 0, 0])
                      ),
                    }
                  )
                : x
            );
            return state
        case 'ADD_ACTOR_TO_BOARD':
            state = state.map((x, i) =>
              i === layer
                ? Object.assign({}, x, {
                    objects: [...state[layer].objects, data],
                  })
                : x
            );
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



// TODO needs to be revised, assuming layer 0 for now
function getTile(board, { layerId = 0, column, row }) {
    let { tiles = null, columns, rows } = board; // TODO remove once no longer dependant
    tiles = tiles || path(['layers', layerId, 'tiles'], board);
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

function getAdjacentCoords(board, coord) {
  return map(partial(getAdjacentCoord, [board, coord]), {
    left: "left",
    right: "right",
    up: "up",
    down: "down"
  });
}

function getAdjacentCoord({ rows, columns }, { row, column }, direction) {
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

  return inBounds({ rows, columns }, { row, column })
    ? Coord({ row, column })
    : undefined;
}

function Coord({ layerId = 0, row = 0, column = 0 }) {
  if(!(this instanceof Coord)) return new Coord({ layerId, row, column });
  this.row = row;
  this.column = column;
  this.layerId = layerId;
}

Coord.prototype.toJSON = function() {
  const { row, column, layerId } = this;
  return { row, column, layerId };
}

board.getTile = getTile
board.Coord = Coord;
board.reduce = board
board.getAdjacentTiles = getAdjacentTiles
board.getAdjacentTile = getAdjacentTile
board.getAdjacentCoords = getAdjacentCoords
board.getAdjacentCoord = getAdjacentCoord
export default board