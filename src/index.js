import React from 'react';
import ReactDOM from 'react-dom';
import Tile from './Board/Tile';
import './index.css';

ReactDOM.render((
        <div style={{padding: '0.5em', backgroundColor: 'pink', width: 500, flexDirection: 'row', display: 'flex'}}>
            <Tile
                onPress={() => {}}
                rowIndex={1}
                columnIndex={1}
                value='A'
                isPermanentlyRevealed={false}
                isFlipped={false}
            />
            <Tile
                onPress={() => {}}
                rowIndex={1}
                columnIndex={1}
                value='A'
                isPermanentlyRevealed={false}
                isFlipped={false}
            />
        </div>
    ),
    document.getElementById('root')
);
