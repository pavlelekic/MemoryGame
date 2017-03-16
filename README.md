## Memory Game
Written in React, however I didn't use Redux, but I made the same separation of game logic and rendering part, just without Redux. Take a look at the Level class (under GameLogic/ dir), the pressTile() method would be an action in Redux, and all the other public methods would be selectors. So it's easy to see how this translates into Redux.

I didn't put any shouldComponentUpdate() methods in any of the components but it's easy to add them because I used Immutable.js for revealed tiles map, so all the changes would be easy to catch with just equality check.

[![Screen Shot 2017-03-16 at 11.54.13.png](https://s15.postimg.org/hj8002i6z/Screen_Shot_2017_03_16_at_11_54_13.png)](https://postimg.org/image/biab2zvkn/)

To run the game: `npm start`
