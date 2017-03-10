// @flow weak
import {Map} from 'immutable';
import {EventEmitter2} from 'eventemitter2';
import generateTilesMatrix from './generateTilesMatrix';

const SCORE_INCREMENT = 100;

export default function Level(initialSize = 2) {
    if (initialSize < 2) throw new Error("Game size should be greater than 1!");
    EventEmitter2.call(this);

    var self = this;
    var size = initialSize;
    var tileValues = generateTilesMatrix(size);
    var isFlippedMap = new Map();
    var isPermanentlyRevealedMap = new Map();
    var isBoardFreezed = false;
    var score = 0;
    var secondsRemaining = 40;
    var intervalID = setInterval(decrementSecondsRemaining, 1000);

    function decrementSecondsRemaining() {
        secondsRemaining--;
        self.emit('board-change');

        if (secondsRemaining === 0) {
            clearInterval(intervalID);
            self.emit('time-elapsed');
        }
    }

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

    function handleTilesMatch(rowIndex, columnIndex) {
        moveFilppedTilesToPermanentlyRevealedMap();
        isFlippedMap = new Map();
        isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
        score += SCORE_INCREMENT;
        self.emit('board-change');

        if (isWholeBoardRevealed()) {
            clearInterval(intervalID);
            self.emit('level-completed');
        }
    }

    function handleTilesMismatch(rowIndex, columnIndex) {
        isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
        isBoardFreezed = true;
        self.emit('board-change');

        setTimeout(function() { // CHANGE THIS TO EMIT TILES MATCH!!
            isFlippedMap = new Map();
            isBoardFreezed = false; // REMOVE THIS!
            self.emit('board-change');
        }, 1000);
    }

    function isWholeBoardRevealed() {
        if (isPermanentlyRevealedMap.size < size) {
            return false;
        }

        return isPermanentlyRevealedMap.every(row => row.size === size);
    }

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this.isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this.isFlipped(rowIndex, columnIndex) &&
            !isBoardFreezed
        ) {
            let numberOfTilesFlipped = isFlippedMap.size;

            if (numberOfTilesFlipped === 0) {
                isFlippedMap = isFlippedMap.setIn([rowIndex, columnIndex], true);
                this.emit('board-change');
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
    };

    this.isFlipped = function(rowIndex, columnIndex) {
        return isFlippedMap.getIn([rowIndex, columnIndex], false) === true;
    };

    this.getSecondsRemaining = function() {
        return secondsRemaining;
    };

    this.isPermanentlyRevealed = function(rowIndex, columnIndex) {
        return isPermanentlyRevealedMap.getIn([rowIndex, columnIndex], false) === true;
    };

    this.getTilesMap = function() {
        return tileValues;
    };

    this.getScore = function() {
        return score;
    };

    return this;
}

Level.prototype = Object.create(EventEmitter2.prototype);
Level.prototype.constructor = EventEmitter2;
