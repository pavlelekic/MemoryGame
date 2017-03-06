// @flow weak
import React, {PureComponent} from 'react';

export default class Score extends PureComponent {
    static propTypes = {
        secondsRemaining: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span style={{fontSize: 44}}>{`Remaining ${this.props.secondsRemaining} seconds`}</span>
        );
    }
}
