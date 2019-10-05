function ui({ tileSize }) {
    const root = document.querySelector('body')
    const canvas = root.querySelector('canvas')
    const context = canvas.getContext('2d');
 
    function update(state) {
        render(state)
    }

    function render(state) {
        canvas.width = state.board.columns * tileSize;
        canvas.height = state.board.rows * tileSize;
        state.board.layers.forEach(renderLayer.bind(null, state.board));
    }

    function renderLayer(board, layer) {
        switch (layer.type) {
            case 'tiles':
                renderTiles(board, layer.tiles)
                break;
        
            case 'objects':
                renderObjects(board, layer.objects)
                break;
        }
    }

    function renderObjects(board, objects) {
        // TODO
    }

    function renderTiles ({ rows, columns }, tiles) {
        for (let column = 0; column < columns; column++) {
            for (let row = 0; row < rows; row++) {
                let tile = getTile({ tiles, columns }, { row, column })
                
                renderTile({
                    tile,
                    x: row * tileSize,
                    y: column *tileSize
                })
                
            }
        }
    }
    function getTile({ tiles, columns }, { row, column }) {
        console.log(tiles, columns, row, column);
        
        return tiles[row * columns + column]
    }
    function renderTile({tile, x, y}) {
        if (tile === undefined) return;
        const colours = ['green', 'lightblue'];
        context.fillStyle = colours[tile];
        console.log(colours[tile]);
        
        context.fillRect(x, y, tileSize, tileSize)

    }

    return update
}

export default ui