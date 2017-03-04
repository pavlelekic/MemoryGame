// @flow weak
import React, {Component} from 'react';
// import Score from './Score';
// import Timer from './Timer';
import GameLogic from './GameLogic/GameLogic';
import Board from './Board/Board.js';

export default class GameRootComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameLogic: new GameLogic(4, this.forceUpdate.bind(this))
        };

        (this: any)._onTilePress = this._onTilePress.bind(this);
    }

    _onTilePress(rowIndex, columnIndex) {
        this.state.gameLogic.pressTile(rowIndex, columnIndex);
    }

    render() {
        let gl = this.state.gameLogic;

        return (
            <Board
                isPermanentlyRevealed={gl.isPermanentlyRevealed}
                tiles={gl.getTilesMap()}
                isFlipped={gl.isFlipped}
                onTilePress={this._onTilePress}
                />
        );
    }
}
