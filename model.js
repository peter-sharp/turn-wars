importScripts('/node_modules/redux/dist/redux.js')
importScripts('/board/index.js')

const initialState = {
    board: board.initialState,
    actors: [],
    currentActor: 0
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
        board: board.reduce(state.board, action),
        actors,
        currentActor: updateCurrentActor(state.currentActor, action, actors)
    }
}

const store = Redux.createStore(game)

onmessage = function handleMessage(ev) {
    store.dispatch(ev.data)
}

const unsubscribe = store.subscribe(() => postMessage(store.getState()))
