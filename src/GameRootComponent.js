// @flow weak
import React, {Component} from 'react';
// import Score from './Score';
// import Timer from './Timer';
import Level from './GameLogic/Level';
import Board from './Board/Board.js';

export default class GameRootComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            level: new Level(4, this.forceUpdate.bind(this))
        };

        (this: any)._onTilePress = this._onTilePress.bind(this);
    }

    _onTilePress(rowIndex, columnIndex) {
        this.state.level.pressTile(rowIndex, columnIndex);
    }

    render() {
        let l = this.state.level;

        return (
            <Board
                isPermanentlyRevealed={l.isPermanentlyRevealed}
                tiles={l.getTilesMap()}
                isFlipped={l.isFlipped}
                onTilePress={this._onTilePress}
                />
        );
    }
}
