# [Tetris][game]
[game]: http://stephanie-lee.github.io/Tetris/

Classic Tetris game where you play at your own pace. Getting past 800 points is tough; past 840 is basically impossible.

**Instruction:**
- **Arrow Keys:** L-left shift, R-right shift, Up-rotate, Down-down
- **Space:** quick drop

##Game
* Javascript functions determine game logic such as collisions between piece/piece and piece/wall.
* Keypress listeners attached to game controls.
* Score is updated and assigned to div tag.
* Game reset redraws a new board and resets score.

##Pieces
Pieces exist inside a bounding 3 x 3 square and rotate clockwise around the middle square. Pieces can move right, left, down and also a quick drop. Pieces can still rotate and move left and right once at the bottom, unless quick drop was used.

##Score
Speed begins at 0.8 seconds per drop and increases with score.
Score keeper incorporate bonus scores:
* 1 line = 10 points
* 2 lines = 30 points
* 3 lines = 60 points
* 4 lines = 100 points

##Future Additions
- [ ] Placed pieces maintain color once lines cleared
- [ ] Menu and instructions
- [ ] Key listeners that allow more than one key to be pressed (i.e. rotate and right shift)
- [ ] Pieces can still rotate when up against a wall (i.e. wall kicks)
- [ ] Pieces spawn in random positions
