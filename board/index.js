(function(global, factory) {
    global.board = {}
    factory(global.board)
} (this, function(exports) {
    exports.initialState = {
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

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    function randomPick(arr) {
        return arr[getRandomInt(arr.length)]
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

    function inBounds({ columns, rows }, { column, row }) {
        return row >= 0 && column >= 0 && row < rows && column < columns
    }

    exports.getTile = getTile

    exports.reduce = board
}))