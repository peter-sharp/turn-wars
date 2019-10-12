(function(global, factory) {
    global.board = {}
    factory(global.board)
} (this, function(exports) {
    exports.initialState = {
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
 
        const { layer = null } = action
        switch (action.type) {
            case 'REGENERATE_TILES':
                state[layer] = Object.assign(state[layer], {
                    tiles: state[layer].tiles.map(() => randomPick([1, 0, 0]))
                })
                return state
            case 'ADD_ACTOR_TO_BOARD':
                const { actor } = action
                state[layer] = Object.assign({}, state[layer], { objects: [...state[layer].objects, actor] })
                return state
            default:
                return state
        }
    }

    function board(state = initialState, action) {
        const { rows, columns } = state
        return {
            layers: updateLayers(state.layers, action, { rows, columns }),
            columns,
            rows
        }
    }

    exports.reduce = board
}))