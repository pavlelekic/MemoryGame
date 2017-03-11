// @flow weak
import React, {Component} from 'react';
import Score from './Score';
import Timer from './Timer';
import Level from './GameLogic/Level';
import Board from './Board/Board.js';
const TimerMixin = require('react-timer-mixin');
const reactMixin = require('react-mixin');


const modes = {
    REPLAY_CURRENT_LEVEL: 'REPLAY_CURRENT_LEVEL',
    PLAY_NEXT_LEVEL: 'PLAY_NEXT_LEVEL',
    PLAYING: 'PLAYING'
};

class MemoryGame extends Component {
    constructor(props) {
        super(props);

        this._size = 2;

        (this: any)._onTilePress = this._onTilePress.bind(this);
        (this: any).forceUpdate = this.forceUpdate.bind(this);
        (this: any)._onGameOverTimeElapsed = this._onGameOverTimeElapsed.bind(this);
        (this: any)._detachListeners = this._detachListeners.bind(this);
        (this: any)._attachListeners = this._attachListeners.bind(this);
        (this: any)._startLevel = this._startLevel.bind(this);
        (this: any)._advanceToNextLevel = this._advanceToNextLevel.bind(this);
        (this: any)._replayCurrentLevel = this._replayCurrentLevel.bind(this);
        (this: any)._onTilesMismatch = this._onTilesMismatch.bind(this);
        (this: any)._onGameOverLevelCompleted = this._onGameOverLevelCompleted.bind(this);
    }

    _onGameOverTimeElapsed() {
        this.setState({
            mode: modes.REPLAY_CURRENT_LEVEL
        });
    }

    _startLevel() {
        this.setState({
            mode: modes.PLAYING,
            level: new Level(this._size)
        }, this._attachListeners);
    }

    _onGameOverLevelCompleted() {
        this.setState({
            mode: modes.PLAY_NEXT_LEVEL
        });
    }

    _onTilesMismatch(firstFlippedTile, secondFlippedTile) {
        this.setState({
            tileMismatches: [
                firstFlippedTile,
                secondFlippedTile
            ]
        });

        this.setTimeout(() => {
            this.setState({
                tileMismatches: null
            });
        }, 800);
    }

    _attachListeners() {
        this.state.level.addListener('board-changed', this.forceUpdate);
        this.state.level.addListener('time-elapsed', this._onGameOverTimeElapsed);
        this.state.level.addListener('level-completed', this._onGameOverLevelCompleted);
        this.state.level.addListener('tiles-mismatch', this._onTilesMismatch);
    }

    _detachListeners() {
        this.state.level.removeListener('board-changed', this.forceUpdate);
        this.state.level.removeListener('time-elapsed', this._onGameOverTimeElapsed);
        this.state.level.removeListener('level-completed', this._onGameOverLevelCompleted);
        this.state.level.removeListener('tiles-mismatch', this._onTilesMismatch);
    }

    _advanceToNextLevel() {
        this._detachListeners();
        this._size += 2;
        this._startLevel();
    }

    _replayCurrentLevel() {
        this._detachListeners();
        this._startLevel();
    }

    componentWillMount() {
        this._startLevel();
    }

    componentWillUnmount() {
        this._detachListeners();
    }

    _onTilePress(rowIndex, columnIndex) {
        this.state.level.pressTile(rowIndex, columnIndex);
    }

    _renderDoYouWantToReplayCurrentLevel() {
        return (
            <div>
                <h2>No more time!</h2>
                <h3>Play again this level?</h3>
                <button onClick={this._replayCurrentLevel}>Go</button>
            </div>
        );
    }

    _renderPlayNextLevel() {
        return (
            <div>
                <h2>LEVEL COMPLETED!!</h2>
                <h3>Advance to next level?</h3>
                <button onClick={this._advanceToNextLevel}>Go</button>
            </div>
        );
    }

    _renderGame() {
        let l = this.state.level;

        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Timer secondsRemaining={l.getSecondsRemaining()} />
                <Score score={l.getScore()} />
                <Board
                    isPermanentlyRevealed={l.isPermanentlyRevealed}
                    tiles={l.getTilesMap()}
                    isFlipped={l.isFlipped}
                    onTilePress={this._onTilePress}
                    tileMismatches={this.state.tileMismatches}
                    />
            </div>
        );
    }

    render() {
        switch (this.state.mode) {
            case modes.PLAYING:
            return this._renderGame();

            case modes.REPLAY_CURRENT_LEVEL:
            return this._renderDoYouWantToReplayCurrentLevel();

            case modes.PLAY_NEXT_LEVEL:
            return this._renderPlayNextLevel();

            default:
            throw new Error(`Unknown mode '${this.state.mode}'!`)
        }
    }
}

reactMixin(MemoryGame.prototype, TimerMixin);

export default MemoryGame;
