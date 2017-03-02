// @flow weak
import React, {Component} from 'react';
import Tile from './Tile';


export default class Board extends Component {
    static propTypes = {
        isPermanentlyRevealed: React.PropTypes.func.isRequired,
        tiles: React.PropTypes.object.isRequired,
        isFlipped: React.PropTypes.func.isRequired,
        onTilePress: React.PropTypes.func.isRequired
    };

    _renderRow(row, rowIndex) {
        return (
            <div>
                {row.map((tileData, columnIndex) => this._renderTile(rowIndex, columnIndex), this)}
            </div>
        );
    }

    _renderTile(rowIndex, columnIndex) {
        return (
            <Tile
                isFlipped={this.props.isFlipped(rowIndex, columnIndex)}
                isPermanentlyRevealed={this.props.isPermanentlyRevealed(rowIndex, columnIndex)}
                onPress={this.props.onTilePress}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                value={this.props.tiles.getIn([rowIndex, columnIndex])}
                />
        );
    }

    render() {
        return (
            <div>
                {this.props.tiles.map(this._renderRow, this)}
            </div>
        );
    }
}
