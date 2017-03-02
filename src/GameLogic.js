// @flow weak
import {Map, fromJS} from 'immutable';
import {EventEmitter2} from 'eventemitter2';

export default function GameLogic(initialSize = 2, onChange) {
    if (initialSize < 2) throw new Error("Game size should be greater than 1!");
    EventEmitter2.call(this);

    var size = initialSize;
    var tileValues;
    var isFlippedMap;
    var isPermanentlyRevealedMap;

    function initializeLevel(size) {
        tileValues = generateTilesGrid(size);
        isFlippedMap = new Map();
        isPermanentlyRevealedMap = new Map();
    }

    initializeLevel(size);

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this.isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this.isFlipped(rowIndex, columnIndex)
        ) {
            let numberOfTilesFlipped = isFlippedMap.size;

            if (numberOfTilesFlipped === 0) {
                isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
                onChange();
            }
            else if (numberOfTilesFlipped === 1) {
                // check if tiles match
                // if so, add score and keep them open (move from isFlippedMap to isPermanentlyRevealedMap)
                // else setState({selectedTiles: {}});
            }
        }
    }

    // this.getScore = function() {
    //     isPermanentlyRevealedMap.length * 100 - secondsElapsed
    // }

    this.isFlipped = function(rowIndex, columnIndex) {
        return isFlippedMap.getIn([rowIndex, columnIndex], false) === true;
    }

    this.isPermanentlyRevealed = function(rowIndex, columnIndex) {
        return isPermanentlyRevealedMap.getIn([rowIndex, columnIndex], false) === true;
    }

    this.getTilesMap = function() {
        return tileValues;
    }

    return this;
}

GameLogic.prototype = Object.create(EventEmitter2.prototype);
GameLogic.prototype.constructor = EventEmitter2;

const possibleTileValues = 'ABCDEFGHIJKLMNOPQRSTUWXYZ1234567890';

function generateTilesGrid(size: number) {
    let map = {};
    let charIndex;

    for (let i = 0; i < size; i++) {
        map[i] = {};

        for (let j = 0; j < size; j++) {
            charIndex = Math.floor(Math.random() * size);
            map[i][j] = possibleTileValues[charIndex];
        }
    }

    return fromJS(map);
}
