// @flow weak
import React, {Component} from 'react';
import Score from './Score';
import Timer from './Timer';
import GameLogic from './GameLogic';
import Board from './Board/Board.js';

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameLogic: new GameLogic(3, this.forceUpdate.bind(this))
        };
    }

    render() {
        let gl = this.state.gameLogic;

        <Board
            isPermanentlyRevealed={gl.isPermanentlyRevealed}
            tiles={gl.getTilesMap()}
            isFlipped={gl.isFlipped}
            onTilePress={gl.pressTile}
            />
    }
}
