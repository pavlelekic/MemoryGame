// @flow weak
import React, {Component} from 'react';
import {Map} from 'immutable';
import Tile from './Tile';

const possibleTileValues = 'ABCDEFGHIJKLMNOPQRSTUWXYZ1234567890';

export default class Board extends Component {
    size = 2;

    constructor(props) {
        super(props);

        this.state = {
            tileValues: this._generateMap(this._generateRandomTileValue),
            isFlippedMap: new Map(),
            isPermanentlyRevealedMap: new Map()
        }
    }

    _generateMap(valueGenerator) {
        let map = new Map();

        for (let i = 0; i < this.size; i++) {
            map[i] = new Map();

            for (let j = 0; j < this.size; j++)
                map[i][j] = valueGenerator(i, j);
        }

        return map;
    }

    _generateRandomTileValue() {
        let charIndex = Math.floor(Math.random() * this.size);
        return possibleTileValues[charIndex];
    }

    _onTilePress(rowIndex, columnIndex) {
        if (!this._isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this._isFlipped(rowIndex, columnIndex)
        ) {
            let numberOfTilesFlipped = this.state.isFlippedMap.length;

            if (numberOfTilesFlipped === 0) {
                this.setState({
                    isFlippedMap: this.state.isFlippedMap.setIn([rowIndex, columnIndex], true)
                });
            }
            else if (numberOfTilesFlipped === 1) {
                // check if tiles match
                // if so, add score and keep them open (move from isFlippedMap to isPermanentlyRevealedMap)
                // else setState({selectedTiles: {}});
            }
        }
    }

    _isFlipped(rowIndex, columnIndex) {
        return this.state.isFlippedMap[rowIndex][columnIndex] === true;
    }

    _isPermanentlyRevealed(rowIndex, columnIndex) {
        return this.state.isPermanentlyRevealedMap[rowIndex][columnIndex] === true;
    }

    _renderRow(rowIndex) {
        return (
            <tr>
                {this.state.tileValues[rowIndex].map((tileData, columnIndex) => this._renderTile(rowIndex, columnIndex))}
            </tr>
        );
    }

    _renderTile(rowIndex, columnIndex) {
        return (
            <Tile
                isFlipped={t.isFlipped}
                isPermanentlyRevealed={t.isPermanentlyRevealed}
                onPress={this._onTilePress}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                value={this.state.tileValues.getIn([rowIndex, columnIndex])}
                />
        );
    }

    render() {
        return (
            <div>
                {this.state.tiles.map((row, index) => this._renderRow(index))}
            </div>
        );
    }
}
