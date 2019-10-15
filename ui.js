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
                emit({
                    type: 'START_GAME',
                    data: {
                        startingUnits: ['infantry'],
                        players: 2
                    },
                })
            }
        }
    })
 
    function update(state) {
        render(state)
    }

    let mapStyle = defaultMapStyle({ tileSize, context })

    function render(state) {
        console.info(state)
        canvas.width = state.board.columns * tileSize;
        canvas.height = state.board.rows * tileSize;
        state.board.layers.forEach(renderLayer.bind(null, state));
    }
    
    function renderLayer(state, layer) {
        switch (layer.type) {
            case 'tiles':
                renderTiles(state, layer.tiles)
                break;
        
            case 'objects':
                renderObjects(state, layer.objects)
                break;
        }
    }

    function renderObjects({ actors }, objects) {
        objects.forEach(({ index, coords }) => {
            const actor = actors[index]
            mapStyle.objects[actor.type](coords)
        })
    }

    function renderTiles ({ board }, tiles) {
        const { rows, columns } = board
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