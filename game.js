import ui from '/ui.js';

const game = new Worker('/model.js', { name: 'model' })

const update = ui({
    tileSize: 64,
    emit: game.postMessage.bind(game)
})

game.onmessage = ({ data }) => update(data)


