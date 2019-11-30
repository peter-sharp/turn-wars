importScripts('/node_modules/redux/dist/redux.js')
importScripts('/board/index.js')

const initialState = {
    board: board.initialState,
    actors: [],
    currentActor: 0,
    players: []
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
    if('NEXT_ACTOR' == action.type) {
        return state = (state + 1) % actors.length
    } else {
        return state
    }
}

function game(state = initialState, action) {
    let actors;
    switch (action.type) {
        case 'START_GAME':
            
            const players = range(action.data.players).map((i) => ({ name: `Player ${i + 1}`}))

            actors = players.reduce((actors, player, i) => {
                return actors.concat(
                    action.data.startingUnits.map(type => createUnit({ type, owner: i }))
                )
            }, [])

            let newBoard = board.reduce(state.board, {
                type: 'REGENERATE_TILES',
                data: {
                    layer: 0
                }
            })

            newBoard = actors.reduce((newBoard, { owner }, index) => {
                return board.reduce(newBoard, {
                    type: 'ADD_ACTOR_TO_BOARD',
                    data: {
                        layer: 1,
                        index,
                        coords: {
                            column: Math.floor((state.board.columns / players.length) * owner + index),
                            row:    Math.floor((state.board.rows    / players.length) * owner + index)
                        }
                    }
                })
            }, newBoard)

            return Object.assign({}, state, {
                board: newBoard,
                actors,
                players
            })
    
        default:
            actors = updateActors(state.actors, action)
            return {
                board: board.reduce(state.board, action),
                actors,
                currentActor: updateCurrentActor(state.currentActor, action, actors)
            }
    }
    
    
}

function findNearestTerrainType(layer, type, coord) {
    if(type == board.getTile(layer, coord)) {}
}

const store = Redux.createStore(game)

onmessage = function handleMessage(ev) {
    store.dispatch(ev.data)
}

const unsubscribe = store.subscribe(() => postMessage(store.getState()))

function range(length) {
    return Object.keys(Array.from({ length })).map(toInt)
}

const toInt = (x) => parseInt(x, 10)

function createUnit({ owner = 0, type }) {
    return {
        owner,
        type
    }
}