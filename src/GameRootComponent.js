// @flow weak
import React, {Component} from 'react';
import Score from './Score';
import Timer from './Timer';
import Level from './GameLogic/Level';
import Board from './Board/Board.js';

const modes = {
    DO_YOU_WANT_TO_REPLAY_CURRENT_LEVEL: 'DO_YOU_WANT_TO_REPLAY_CURRENT_LEVEL',
    PLAY_NEXT_LEVEL: 'PLAY_NEXT_LEVEL',
    PLAYING: 'PLAYING'
};

export default class GameRootComponent extends Component {
    constructor(props) {
        super(props);

        this._size = 2;

        (this: any)._onTilePress = this._onTilePress.bind(this);
        (this: any).forceUpdate = this.forceUpdate.bind(this);
        (this: any)._onGameOverTimeElapsed = this._onGameOverTimeElapsed.bind(this);
        (this: any)._detachListeners = this._detachListeners.bind(this);
        (this: any)._attachListeners = this._attachListeners.bind(this);
        (this: any)._startLevel = this._startLevel.bind(this);

    }

    _onGameOverTimeElapsed() {
        this.setState({
            mode: modes.DO_YOU_WANT_TO_REPLAY_CURRENT_LEVEL,
        });
    }

    _startLevel() {
        this.setState({
            mode: modes.PLAYING,
            level: new Level(this._size)
        }, this._attachListeners);
    }

    _attachListeners() {
        this.state.level.addListener('rerender', this.forceUpdate);
        this.state.level.addListener('game-over-time-elapsed', this._onGameOverTimeElapsed);
        
    }

    _detachListeners() {
        this.state.level.removeListener('rerender', this.forceUpdate);
        this.state.level.removeListener('game-over-time-elapsed', this.forceUpdate);
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
                <h2>Do you want to play again this level?</h2>
                <button>Go</button>
            </div>
        );
    }

    _renderPlayNextLevel() {
        return (
            <div>
                <h2>Play next level?</h2>
                <button>Go</button>
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
                    />
            </div>
        );
    }

    render() {
        switch (this.state.mode) {
            case modes.PLAYING:
            return this._renderGame();

            case modes.DO_YOU_WANT_TO_REPLAY_CURRENT_LEVEL:
            return this._renderDoYouWantToReplayCurrentLevel();

            case modes.PLAY_NEXT_LEVEL:
            return this._renderPlayNextLevel();

            default:
            throw new Error(`Unknown mode '${this.state.mode}'!`)
        }
    }
}
