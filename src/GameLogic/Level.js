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
    var flippedTile = null;
    var isPermanentlyRevealedMap = new Map();
    var score = 0;
    var secondsRemaining = 40;
    var intervalID = setInterval(decrementSecondsRemaining, 1000);

    function decrementSecondsRemaining() {
        secondsRemaining--;
        self.emit('board-changed');

        if (secondsRemaining === 0) {
            clearInterval(intervalID);
            self.emit('time-elapsed');
        }
    }

    function handleTilesMatch(rowIndex, columnIndex) {
        isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([rowIndex, columnIndex], true);
        isPermanentlyRevealedMap = isPermanentlyRevealedMap.setIn([flippedTile.rowIndex, flippedTile.columnIndex], true);
        flippedTile = null;
        score += SCORE_INCREMENT;
        self.emit('board-changed');

        if (isWholeBoardRevealed()) {
            clearInterval(intervalID);
            self.emit('level-completed');
        }
    }

    function handleTilesMismatch(rowIndex, columnIndex) {
        self.emit('tiles-mismatch', {rowIndex, columnIndex}, flippedTile);
        flippedTile = null;
        self.emit('board-changed');
    }

    function isWholeBoardRevealed() {
        if (isPermanentlyRevealedMap.size < size) {
            return false;
        }

        return isPermanentlyRevealedMap.every(row => row.size === size);
    }

    function checkIfTilesMatch(rowIndex, columnIndex) {
        let firstFlippedTileValue = tileValues[flippedTile.rowIndex][flippedTile.columnIndex]
        let secondFlippedTileValue = tileValues[rowIndex][columnIndex];

        if (firstFlippedTileValue === secondFlippedTileValue) {
            handleTilesMatch(rowIndex, columnIndex);
        }
        else {
            handleTilesMismatch(rowIndex, columnIndex);
        }
    }

    // public part

    this.pressTile = function(rowIndex, columnIndex) {
        if (!this.isPermanentlyRevealed(rowIndex, columnIndex) &&
            !this.isFlipped(rowIndex, columnIndex)
        ) {
            if (flippedTile) {
                checkIfTilesMatch(rowIndex, columnIndex);
            }
            else {
                flippedTile = flippedTile = {rowIndex, columnIndex};
                this.emit('board-changed');
            }
        }
    };

    this.isFlipped = function(rowIndex, columnIndex) {
        return flippedTile !== null && flippedTile.rowIndex === rowIndex && flippedTile.columnIndex === columnIndex;
    };

    this.getSecondsRemaining = function() {
        return secondsRemaining;
    };

    this.isPermanentlyRevealed = function(rowIndex, columnIndex) {
        return isPermanentlyRevealedMap.getIn([rowIndex, columnIndex], false);
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
