import ui from '/ui.js'

const game = new Worker('/model.js')

const update = ui({
    tileSize: 64
})

game.onmessage = ({ data }) => update(data)

game.postMessage({
    type: 'CREATE_ACTOR',
    data: {
        type: 'infantry',
        owner: 0
    }
})
game.postMessage({
    type: 'CREATE_ACTOR',
    data: {
        type: 'tank',
        owner: 0
    }
})
game.postMessage({
    type: 'CREATE_ACTOR',
    data: {
        type: 'infantry',
        owner: 1
    }
})
game.postMessage({
    type: 'CREATE_ACTOR',
    data: {
        type: 'tank',
        owner: 1
    }
})