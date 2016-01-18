var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
var linecount = document.getElementById('lines');
var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
var width = 10;
var height = 20;
var tilepixels = 24;
canvas.width = width * tilepixels;
canvas.height = height * tilepixels;

var board = [];
for (var row = 0; row < 20; row++) {
    board[row] = [];
    for (var tile = 0; tile < 10; tile++) {
        board[row][tile] = false;
    }
}

function drawSquare(x, y) {
  ctx.fillRect(x * tilepixels, y * tilepixels, tilepixels, tilepixels);
  stroke = ctx.strokeStyle;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(x * tilepixels, y * tilepixels, tilepixels, tilepixels);
  ctx.strokeStyle = "#888";
}

function drawBoard(clear) {
  if (clear) {
    fill = ctx.fillStyle;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        board[y][x] = false;
        ctx.fillStyle = '#333333';
        drawSquare(x, y, tilepixels, tilepixels);
      }
    }
    ctx.fillStyle = fill;
  } else {
  fill = ctx.fillStyle;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      ctx.fillStyle = board[y][x] ? 'gray' : '#333333';
      drawSquare(x, y, tilepixels, tilepixels);
    }
  }
  ctx.fillStyle = fill;
}
}


function Piece(patterns, color) {
  this.pattern = patterns[0];
  this.patterns = patterns;
  this.patternIdx = 0;

  this.color = color;

  this.x = 0;
  this.y = -2;
}

var pieces = [
  [I, "cyan"],
  [J, "blue"],
  [L, "orange"],
  [O, "#ffe805"],
  [S, "green"],
  [T, "purple"],
  [Z, "red"]
];

function newPiece() {
  var piece = pieces[parseInt(Math.random() * pieces.length, 10)];
  return new Piece(piece[0], piece[1]);
}

Piece.prototype._fill = function(color) {
  fill = ctx.fillStyle;
  ctx.fillStyle = color;
  var x = this.x;
  var y = this.y;
  for (var ix = 0; ix < this.pattern.length; ix++) {
    for (var iy = 0; iy < this.pattern.length; iy++) {
      if (this.pattern[ix][iy]) {
        drawSquare(x + ix, y + iy);
      }
    }
  }
  ctx.fillStyle = fill;
};

Piece.prototype._collides = function(dx, dy, pattern) {
  for (var ix = 0; ix < pattern.length; ix++) {
    for (var iy = 0; iy < pattern.length; iy++) {
      if (!pattern[ix][iy]) {
        continue;
      }

      var x = this.x + ix + dx;
      var y = this.y + iy + dy;
      if (y >= height || x < 0 || x >= width) {
        return true;
      }
      if (y < 0) {
        continue;
      }
      if (board[y][x]) {
        return true;
      }
    }
  }
  return false;
};

var lines = 0;
var done = false;
var score = 0;
Piece.prototype.lock = function() {
  for (var ix = 0; ix < this.pattern.length; ix++) {
    for (var iy = 0; iy < this.pattern.length; iy++) {
      if (!this.pattern[ix][iy]) {
        continue;
      }

      if (this.y + iy < 0) {
        alert("Game Over");
        done = true;
        return;
      }
      board[this.y + iy][this.x + ix] = this.color;
    }
  }

  var nlines = 0;
  for (var y = 0; y < height; y++) {
    var line = true;
    for (var x = 0; x < width; x++) {
      line = line && board[y][x];
    }
    if(line) {
      for (var y2 = y; y2 > 1; y2--) {
        for (var x = 0; x < width; x++) {
          board[y2][x] = board[y2-1][x];
        }
      }
      for (var x = 0; x < width; x++) {
        board[0][x] = false;
      }
      nlines++;
    }
  }
  if (nlines > 0) {
    lines += nlines;
    for (nlines; nlines > 0; nlines-- ) {
      score += nlines * 10;
    }
    drawBoard();
    linecount.textContent = "Score: " + score;
  }
};

Piece.prototype.undraw = function(ctx) {
  this._fill("#333333");
};

Piece.prototype.draw = function(ctx) {
  this._fill(this.color);
};

Piece.prototype.down = function() {
  if (this._collides(0, 1, this.pattern)) {
    this.lock();
    piece = newPiece();
  } else {
    this.undraw();
    this.y++;
    this.draw();
  }
};

Piece.prototype.drop = function() {  // add drop functionality
  while (!this._collides(0, 1, this.pattern)) {
    this.down();
  }
};

Piece.prototype.moveRight = function() {
  if (!this._collides(1, 0, this.pattern)) {
    this.undraw();
    this.x++;
    this.draw();
  }
};

Piece.prototype.moveLeft = function() {
  if (!this._collides(-1, 0, this.pattern)) {
    this.undraw();
    this.x--;
    this.draw();
  }
};

Piece.prototype.rotate = function() {
  var nextpat = this.patterns[(this.patternIdx + 1) % this.patterns.length];
  if (!this._collides(0, 0, nextpat)) {
    this.undraw();
    this.patternIdx = (this.patternIdx+ 1) % this.patterns.length;
    this.pattern = this.patterns[this.patternIdx];
    this.draw();
  }
};

var dropStart = Date.now();
document.body.addEventListener("keydown", function(e) {
  if (e.keyCode === 38) { //up
    piece.rotate();
  }
  if (e.keyCode === 40) { //down
    piece.down();
  }
  if (e.keyCode === 37) { //left
    piece.moveLeft();
  }
  if (e.keyCode === 39) { //right
    piece.moveRight();
  }
  if (e.keyCode === 32) { //spacebar
    piece.drop();
    dropStart -= 750;
  }
}, false);

var done = false;
function main() {
  var now = Date.now();
  var timeDiff = now - dropStart;

  score = parseInt(linecount.textContent.split(" ")[1]);

  if (timeDiff > (800 - score )) {
    piece.down();
    dropStart = now;
  }

  if(!done) {
    requestAnimationFrame(main);
  }
}

function reset() {
  piece = newPiece();
  drawBoard(true);
  linecount.textContent = "Score: 0";
  main();
}

piece = newPiece();
drawBoard();
linecount.textContent = "Score: 0";
main();
