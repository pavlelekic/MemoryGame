// @flow weak
import {Map} from 'immutable';
const possibleTileValues = 'ABCDEFGHIJKLMNOPQRSTUWXYZ1234567890';

export default function GameLogic(initialSize = 2, onChange) {
    if (initialSize < 2) throw new Error("Game size should be greater than 1!");

    var levelStartTime;
    var size = initialSize;
    var tileValues;
    var isFlippedMap;
    var isPermanentlyRevealedMap;

    function initializeLevel(size) {
        levelStartTime = Date.now() / 1000; // parseInt?
        tileValues = generateMap(generateRandomTileValue);
        isFlippedMap = new Map();
        isPermanentlyRevealedMap = new Map();
    }

    initializeLevel(size);

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this._isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this._isFlipped(rowIndex, columnIndex)
        ) {
            let numberOfTilesFlipped = isFlippedMap.length;

            if (numberOfTilesFlipped === 0) {
                isFlippedMap: this.state.isFlippedMap.setIn([rowIndex, columnIndex], true);
                onChange();
            }
            else if (numberOfTilesFlipped === 1) {
                // check if tiles match
                // if so, add score and keep them open (move from isFlippedMap to isPermanentlyRevealedMap)
                // else setState({selectedTiles: {}});
            }
        }
    }

    this.getScore() {
        isPermanentlyRevealedMap.length * 100 - secondsElapsed
    }

    this.isFlipped = function(rowIndex, columnIndex) {
        return isFlippedMap[rowIndex][columnIndex] === true;
    }

    this.isPermanentlyRevealed = function(rowIndex, columnIndex) {
        return isPermanentlyRevealedMap[rowIndex][columnIndex] === true;
    }

    this.getTilesMap = function() {
        return tileValues;
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


function generateMap(valueGenerator) {
    let map = new Map();

    for (let i = 0; i < this.size; i++) {
        map[i] = new Map();

        for (let j = 0; j < this.size; j++)
            map[i][j] = valueGenerator(i, j);
    }

    return map;
}

function generateRandomTileValue() {
    let charIndex = Math.floor(Math.random() * this.size);
    return possibleTileValues[charIndex];
}
