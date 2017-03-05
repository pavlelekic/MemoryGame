// @flow weak
import {Map} from 'immutable';
import {EventEmitter2} from 'eventemitter2';
import generateTilesMatrix from './generateTilesMatrix';

export default function Level(initialSize = 2) {
    if (initialSize < 2) throw new Error("Game size should be greater than 1!");
    EventEmitter2.call(this);

    var size = initialSize;
    var tileValues = generateTilesMatrix(size);
    var isFlippedMap = new Map();
    var isPermanentlyRevealedMap = new Map();
    var isBoardFreezed = false;

    function getFlippedTileValue() {
        let rowIndex = isFlippedMap.keySeq().first();
        let columnIndex = isFlippedMap.get(rowIndex).keySeq().first();

        return tileValues[rowIndex][columnIndex];
    }

    function moveFilppedTilesToPermanentlyRevealedMap() {
        isFlippedMap.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
            isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
        }));
    }

    var self = this;

    function handleTilesMatch(rowIndex, columnIndex) {
        moveFilppedTilesToPermanentlyRevealedMap();
        isFlippedMap = new Map();
        isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
        self.emit('rerender');
    }

    function handleTilesMismatch(rowIndex, columnIndex) {
        isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
        isBoardFreezed = true;
        self.emit('rerender');

        setTimeout(function() {
            isFlippedMap = new Map();
            isBoardFreezed = false;
            self.emit('rerender');
        }, 1000);
    }

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this.isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this.isFlipped(rowIndex, columnIndex) &&
            !isBoardFreezed
        ) {
            let numberOfTilesFlipped = isFlippedMap.size;

            if (numberOfTilesFlipped === 0) {
                isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
                this.emit('rerender');
            }
            else if (numberOfTilesFlipped === 1) {
                var firstFlippedTileValue = getFlippedTileValue();
                var secondFlippedTileValue = tileValues[rowIndex][columnIndex];

                if (firstFlippedTileValue === secondFlippedTileValue) {
                    handleTilesMatch(rowIndex, columnIndex);
                }
                else {
                    handleTilesMismatch(rowIndex, columnIndex);
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

Level.prototype = Object.create(EventEmitter2.prototype);
Level.prototype.constructor = EventEmitter2;
