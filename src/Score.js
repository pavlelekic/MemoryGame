// @flow weak
import './Score.css';
import React, {PureComponent} from 'react';

export default class Score extends PureComponent {
    static propTypes = {
        score: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span className='score-text'>
                {'Score: '}
                <span className='score-value'>{this.props.score}</span>
                {' points'}
            </span>
        );
    }
}
