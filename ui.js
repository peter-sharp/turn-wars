import defaultMapStyle from '/mapStyles/default.js'
import fillTile from '/mapStyles/fillTile.js'
import getTile from '/getTile.js'

import Vue from '/node_modules/vue/dist/vue.esm.browser.js'
function ui({ tileSize, emit }) {
    const root = document.querySelector('#root')

    let canvas;
    let context;
    

    const view = new Vue({
        el: root,
        mounted() {
            canvas = this.$refs.canvas
            context = canvas.getContext('2d')
        },
        methods: {
            
            startGame() {
                console.log('starting game')
                emit({
                    type: 'REGENERATE_TILES',
                    layer: 0
                })

                emit({
                    type: 'CREATE_ACTOR',
                    data: {
                        type: 'infantry',
                        owner: 0
                    }
                })

                emit({
                    type: 'CREATE_ACTOR',
                    data: {
                        type: 'infantry',
                        owner: 1
                    }
                })
            }
        }
    })
 
    function update(state) {
        render(state)
    }

    let mapStyle = defaultMapStyle({ tileSize, context })

    function render(state) {
        canvas.width = state.board.columns * tileSize;
        canvas.height = state.board.rows * tileSize;
        state.board.layers.forEach(renderLayer.bind(null, state.board));
        console.log(state)
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
                let tile = getTile({ tiles, columns, rows }, { row, column })
                const terrain = { tiles, columns, rows }
                
                renderTile({
                    tile,
                    terrain,
                    row,
                    column
                })
                
            }
        }
    }

    function renderTile({ tile, row, column, terrain }) {
        if (tile === undefined) return;
       
        mapStyle.tiles[tile]({ column, row, terrain, tile })

        
        fillCheckerOverlay(tileSize, { column, row })
    }

   

    function fillCheckerOverlay(tileSize, coord ) {
        const { row, column } = coord
        fillTile(context, `rgba(0,0,0, ${(row + column) % 2 ? 0.1 : 0.2})`, tileSize, coord)
    }


    return update
}


export default ui