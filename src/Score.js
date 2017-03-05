// @flow weak
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Score extends Component {
    static propTypes = {
        score: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span>{`Score: ${this.props.score} points`}</span>
        );
    }
}
