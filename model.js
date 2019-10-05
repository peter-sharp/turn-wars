importScripts('//unpkg.com/redux@4.0.4/dist/redux.js')

const initialState = {
    board: {
        layers: [
            {
                type: 'tiles',
                tiles: [
                    0,0,0,0,0,0,0,0,0,0,
                    0,1,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                ]
            },
            {
                type: 'objects',
                objects: []
            }
        ],
        columns: 10,
        rows: 10,
    },
    actors: [],
    currentActor: 0
}

function updateLayers(state = initialState.board.layers, action) {
    const TILES = 0
    const OBJECTS = 1
    switch (action.type) {
        case 'ADD_ACTOR_TO_BOARD':
            return [
                state[TILES],
                Object.assign({}, state[OBJECTS], { objects: [...state[OBJECTS].objects, action.data]})
            ]
        default:
            return state
    }
}

function board(state = initialState.board, action) {

    return {
        layers: updateLayers(state.layers, action),
        columns: state.columns,
        rows: state.rows
    }
}

function updateActors(state = [], action) {
    switch(action.type) {
        case 'CREATE_ACTOR':
            state = [...state, Object.assign({}, action.data)]
        default:
            return state
    }
}

function updateCurrentActor(state = 0, action, actors) {
    if('NEXT_ACTOR' == action) {
        return state = (state + 1) % actors.length
    } else {
        return state
    }
}

function game(state = initialState, action) {
    const actors = updateActors(state.actors, action)
    return {
        board: board(state.board, action),
        actors,
        currentActor: updateCurrentActor(state.currentActor, action, actors)
    }
}

const store = Redux.createStore(game)

onmessage = function handleMessage(ev) {
    store.dispatch(ev.data)
}

const unsubscribe = store.subscribe(() => postMessage(store.getState()))
