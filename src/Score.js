// @flow weak
import React, {PureComponent} from 'react';

export default class Score extends PureComponent {
    static propTypes = {
        score: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span style={{fontSize: 44}}>{`Score: ${this.props.score} points`}</span>
        );
    }
}
