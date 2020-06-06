import { createStore } from "redux";
import Board from './board/index.js'
import { randomPick } from '/random.js'

const initialState = {
    board: Board.initialState,
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
            state = { ...initialState };
            const players = range(action.data.players).map((i) => ({ name: `Player ${i + 1}`}))

            actors = players.reduce((actors, player, i) => {
                return actors.concat(
                    action.data.startingUnits.map(type => createUnit({ type, owner: i }))
                )
            }, [])

            let newBoard = Board.reduce(state.board, {
                type: 'REGENERATE_TILES',
                data: {
                    layer: 0
                }
            })

            newBoard = actors.reduce((newBoard, { owner }, index) => {
                return Board.reduce(newBoard, {
                  type: "ADD_ACTOR_TO_BOARD",
                  data: {
                    layer: 1,
                    index,
                    coords: findStartingPosition(
                      newBoard,
                      players.length,
                      owner,
                      index
                    ),
                  },
                });
            }, newBoard)

            return Object.assign({}, state, {
                board: newBoard,
                actors,
                players
            })
    
        default:
            actors = updateActors(state.actors, action)
            return {
                board: Board.reduce(state.board, action),
                actors,
                currentActor: updateCurrentActor(state.currentActor, action, actors)
            }
    }
    
    
}

function findStartingPosition(board, numPlayers, owner, index) {
    const { columns, rows} = board
    const coord = Board.Coord({
        column: Math.floor((columns / numPlayers) * owner + index),
        row: Math.floor((rows / numPlayers) * owner + index)
    });
    const layerId = 0
    const grass = 0
    return findNearestTerrainType(board, layerId, grass, coord);
}

function findNearestTerrainType(board, layerId, type, coord) {
    let hit = coord;
    let tries = 0;
    const MAX_TRIES = 4000
    while (
      type != Board.getTile(board, { layerId, ...hit }) &&
      tries < MAX_TRIES
    ) {
      hit = getRandomAjacentCoord(board, { layerId, ...hit });
      if(!hit) hit = coord;
      tries += 1;
    }
    return hit;
}

function getRandomAjacentCoord(board,  coord) {
    const ajacentCoords = Board.getAdjacentCoords(board, coord);
    return randomPick(Object.values(ajacentCoords));
}

const store = createStore(game);

onmessage = function handleMessage(ev) {
    store.dispatch(ev.data)
}

const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    postMessage(state);
})

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