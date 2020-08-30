var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 20;
var ballSpeedY = 5;

const PADDLE_WIDTH = 8;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 8;

var leftPaddleY = 250;
var rightPaddleY = 250;

var stopGame = false;

var playerScore = 0;
var computerScore = 0;
const WINNING_SCORE = 5;

function getMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 20;
  setInterval(function () {
    drawObjects();
    moveBall();
  }, 1000 / framesPerSecond);

  leftPaddleY = canvas.height / 2 - 50;
  rightPaddleY = canvas.height / 2 - 50;

  canvas.addEventListener("mousemove", function (event) {
    var mousePos = getMousePosition(event);

    leftPaddleY = mousePos.y - PADDLE_HEIGHT / 2;
    leftPaddleY = leftPaddleY <= 0 ? 0 : leftPaddleY;
    leftPaddleY =
      leftPaddleY > canvas.height - PADDLE_HEIGHT
        ? canvas.height - PADDLE_HEIGHT
        : leftPaddleY;
  });

  canvas.addEventListener("mousedown", function (event) {
    if (stopGame) {
      stopGame = false;
      playerScore = 0;
      computerScore = 0;
      initialiseBall();
    }
  });
};

function initialiseBall() {
  ballX = canvas.width / 2 - 4;
  ballY = canvas.height / 2 - 4;
}

function drawObjects() {
  //canvas
  drawRect(0, 0, canvas.width, canvas.height, "#000088");

  if (stopGame) {
    var message = playerScore >= 3 ? "Player WINS!" : "Computer WINS!";
    canvasContext.font = "20px Orbitron";
    canvasContext.fillStyle = "#fff";
    canvasContext.fillText(
      message,
      canvas.width / 2 - 100,
      canvas.height / 2 - 50
    );

    canvasContext.fillStyle = "#fff";
    canvasContext.fillText(
      "Click to continue",
      canvas.width / 2 - 100,
      canvas.height / 2 + 50
    );
    return;
  }
  //draw net
  for (let index = 0; index < canvas.height; ) {
    drawRect(canvas.width / 2 - 2, index, 4, 10, "#fff");
    index = index + 10 + 3;
  }
  //left paddle
  drawRect(PADDLE_WIDTH, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "#ffffff");
  //right paddle
  drawRect(
    canvas.width - PADDLE_WIDTH * 2,
    rightPaddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    "#ffffff"
  );

  drawCircle(ballX, ballY, 8, "#fff");

  //scores
  canvasContext.font = "40px Orbitron";
  canvasContext.fillText(playerScore, canvas.width / 2 - 100, 50);
  canvasContext.fillText(computerScore, canvas.width / 2 + 100, 50);
}

function resetComputerPaddle() {
  rightPaddleY = canvas.height / 2 - 50;
}

function resetBall() {
  if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
    stopGame = true;
  } else {
    ballX = canvas.width / 2 - 4;
    ballY = canvas.height / 2 - 4;
    ballSpeedX = -ballSpeedX;
    resetComputerPaddle();
  }
}

function computerMove() {
  var rightPaddleYCenter = rightPaddleY + PADDLE_HEIGHT / 2;
  if (rightPaddleYCenter < ballY - 35) {
    rightPaddleY += 5;
    var newY = rightPaddleY + 5;
    if (newY + PADDLE_HEIGHT > canvas.height) {
      rightPaddleY = canvas.height - PADDLE_HEIGHT;
    } else {
      rightPaddleY = newY;
    }
  } else if (rightPaddleYCenter < ballY + 35) {
    rightPaddleY -= 5;
    if (rightPaddleY < 0) {
      rightPaddleY = 0;
    }
  }
}

function moveBall() {
  if (stopGame) {
    return;
  }
  computerMove();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX >= canvas.width - PADDLE_WIDTH * 2 - BALL_RADIUS) {
    //change angle of ball direction
    if (ballY > rightPaddleY && ballY < PADDLE_HEIGHT + rightPaddleY) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.15;
    } else {
      playerScore++;
      resetBall();
    }
  } else if (ballX <= PADDLE_WIDTH * 2 + BALL_RADIUS) {
    //change angle of ball direction
    if (ballY > leftPaddleY && ballY < PADDLE_HEIGHT + leftPaddleY) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.15;
    } else {
      computerScore++;
      resetBall();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, color);
  canvasContext.fill();
}
