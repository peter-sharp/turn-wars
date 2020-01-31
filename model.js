import { createStore } from "redux";
import board from './board/index.js'

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
                        coords: findStartingPosition(state.board, players.length, owner, index)
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

function findStartingPosition({ columns, rows}, numPlayers, owner, index) {
    const coord = {
        column: Math.floor((columns / numPlayers) * owner + index),
        row: Math.floor((rows / numPlayers) * owner + index)
    };
    const layerId = 0
    return findNearestTerrainType(board, layerId, 1, coord)
}

function findNearestTerrainType(board, layerId, type, coord) {
    const layer = board.layers[layerId]
    let hit = coord;
    if(type != board.getTile(layer, coord)) {
        const newCoord = getRandomAjacentTile(board, layer, coord);
        hit = findNearestTerrainType(board, layerId, type, newCoord);
    }
    return hit;
}

function getRandomAjacentTile(board, layer, coord) {
    board.getAdjacentTiles({})
}

const store = createStore(game);

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