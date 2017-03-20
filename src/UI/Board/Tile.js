// @flow weak
import './Tile.css';
import React, {PureComponent} from 'react';
const classNames = require('classnames');


export default class Tile extends PureComponent {
    static propTypes = {
        onPress: React.PropTypes.func.isRequired,
        rowIndex: React.PropTypes.number.isRequired,
        columnIndex: React.PropTypes.number.isRequired,
        value: React.PropTypes.string.isRequired,
        isPermanentlyRevealed: React.PropTypes.bool.isRequired,
        isFlipped: React.PropTypes.bool.isRequired,
        isMismatched: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        (this: any)._handlePress = this._handlePress.bind(this);
    }

    _handlePress() {
        this.props.onPress(this.props.rowIndex, this.props.columnIndex);
    }

    render() {
        let p = this.props;
        let isRevealed = p.isFlipped || p.isPermanentlyRevealed || p.isMismatched;
        let backClass = classNames("backFace", {backFaceRevealed: isRevealed}, {mismatched: p.isMismatched});
        let frontClass = classNames("frontFace", {frontFaceHidden: isRevealed});

        return (
            <div className="tileContainer" onClick={this._handlePress}>
                <div className={backClass}>{p.value}</div>
                <div className={frontClass}>?</div>
            </div>
        );
    }
}
