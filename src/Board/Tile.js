// @flow weak
import React, {Component} from 'react';
import './Tile.css';


export default class Tile extends Component {
    static propTypes = {
        onPress: React.PropTypes.func.isRequired,
        rowIndex: React.PropTypes.number.isRequired,
        columnIndex: React.PropTypes.number.isRequired,
        value: React.PropTypes.string.isRequired,
        isPermanentlyRevealed: React.PropTypes.bool.isRequired,
        isFlipped: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        (this: any)._handlePress = this._handlePress.bind(this);
    }

    _handlePress() {
        this.props.onPress(this.props.rowIndex, this.props.columnIndex);
    }

    render() {
        let {rowIndex, columnIndex} = this.props;

        return (
            <div
                className="tileContainer"
                key={`${rowIndex},${columnIndex}`}
                onClick={this._handlePress}>

              <div className="backFace">{this.props.value}</div>
              <div className="frontFace">Front</div>
            </div>
        );
    }
}
