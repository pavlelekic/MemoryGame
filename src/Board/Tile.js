// @flow weak
import React, {Component} from 'react';
import './Tile.css';
const classNames = require('classnames');


export default class Tile extends Component {
    static propTypes = {
        onPress: React.PropTypes.func.isRequired,
        rowIndex: React.PropTypes.string.isRequired,
        columnIndex: React.PropTypes.string.isRequired,
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

              <div className={classNames("backFace", {backFaceHidden: this.props.isFlipped})}>{this.props.value}</div>
              <div className={classNames("frontFace", {frontFaceRevealed: this.props.isFlipped})}>Front</div>
            </div>
        );
    }
}
