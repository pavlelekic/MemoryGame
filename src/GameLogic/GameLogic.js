// @flow weak
import {Map, fromJS} from 'immutable';
import {EventEmitter2} from 'eventemitter2';
import generateTilesMatrix from './generateTilesMatrix';

export default function GameLogic(initialSize = 2, onChange) {
    if (initialSize < 2) throw new Error("Game size should be greater than 1!");
    EventEmitter2.call(this);

    var size = initialSize;
    var tileValues;
    var isFlippedMap;
    var isPermanentlyRevealedMap;
    var isBoardFreezed;

    function initializeLevel(size) {
        let mutableTilesGrid = generateTilesMatrix(size);
        tileValues = fromJS(mutableTilesGrid);
        isFlippedMap = new Map();
        isPermanentlyRevealedMap = new Map();
        isBoardFreezed = false;
    }

    function getFlippedTileValue() {
        let rowIndex = isFlippedMap.keySeq().first();
        let columnIndex = isFlippedMap.get(rowIndex).keySeq().first();

        return tileValues.getIn([rowIndex, columnIndex]);
    }

    function moveFilppedTilesToPermanentlyRevealedMap() {
        isFlippedMap.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
            isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
        }));
    }

    initializeLevel(size);

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this.isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this.isFlipped(rowIndex, columnIndex) &&
            !isBoardFreezed
        ) {
            let numberOfTilesFlipped = isFlippedMap.size;

            if (numberOfTilesFlipped === 0) {
                isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
                onChange();
            }
            else if (numberOfTilesFlipped === 1) {
                var firstFlippedTileValue = getFlippedTileValue();
                var secondFlippedTileValue = tileValues.getIn([rowIndex, columnIndex]);

                if (firstFlippedTileValue === secondFlippedTileValue) {
                    moveFilppedTilesToPermanentlyRevealedMap();
                    isFlippedMap = new Map();
                    isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
                    onChange();
                }
                else {
                    isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
                    isBoardFreezed = true;
                    onChange();

                    setTimeout(function() {
                        isFlippedMap = new Map();
                        isBoardFreezed = false;
                        onChange();
                    }, 1000);
                }
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
