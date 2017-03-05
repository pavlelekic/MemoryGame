// @flow weak
import './Tile.css';
import React, {Component} from 'react';
const classNames = require('classnames');


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
        let isRevealed = this.props.isFlipped || this.props.isPermanentlyRevealed;
        let backClass = classNames("backFace", {backFaceHidden: isRevealed});
        let frontClass = classNames("frontFace", {frontFaceRevealed: isRevealed});

        return (
            <div className="tileContainer" onClick={this._handlePress}>
              <div className={backClass}>{this.props.value}</div>
              <div className={frontClass}>?</div>
            </div>
        );
    }
}
