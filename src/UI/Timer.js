// @flow weak
import './Timer.css';
import React, {PureComponent} from 'react';

export default class Timer extends PureComponent {
    static propTypes = {
        secondsRemaining: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span className='timer-text'>
                {'Remaining: '}
                <span className='timer-value'>{this.props.secondsRemaining}</span>
                {' seconds'}
            </span>
        );
    }
}
