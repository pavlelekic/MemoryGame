// @flow weak
/* eslint-disable no-alert, no-console */

import './Board.css';
import React, {Component} from 'react';
import Tile from './Tile';


export default class Board extends Component {
    static propTypes = {
        isPermanentlyRevealed: React.PropTypes.func.isRequired,
        tiles: React.PropTypes.array.isRequired,
        isFlipped: React.PropTypes.func.isRequired,
        onTilePress: React.PropTypes.func.isRequired,
        tileMismatches: React.PropTypes.array
    };

    _renderRow(row, rowIndex) {
        return (
            <div key={rowIndex}>
                {row.map((tileData, columnIndex) => this._renderTile(rowIndex, columnIndex), this)}
            </div>
        );
    }

    _renderTile(rowIndex, columnIndex) {
        let tm = this.props.tileMismatches;
        let isMismatched = tm instanceof Array && (
            (tm[0].rowIndex === rowIndex && tm[0].columnIndex === columnIndex) ||
            (tm[1].rowIndex === rowIndex && tm[1].columnIndex === columnIndex)
        );

        return (
            <Tile
                key={columnIndex}
                isFlipped={this.props.isFlipped(rowIndex, columnIndex)}
                isMismatched={isMismatched}
                isPermanentlyRevealed={this.props.isPermanentlyRevealed(rowIndex, columnIndex)}
                onPress={this.props.onTilePress}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                value={this.props.tiles[rowIndex][columnIndex]}
                />
        );
    }

    render() {
        return (
            <div className="board">
                {this.props.tiles.map(this._renderRow, this)}
            </div>
        );
    }
}
