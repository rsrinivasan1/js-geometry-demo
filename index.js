var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");
var currentPoint;
var id;

ctx.clearRect(0, 0, 800, 600);

ctx.strokeStyle = "#F00";
ctx.fillStyle = "#F00";
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";

var points = [new Point(300, 300), new Point(400, 200), new Point(500, 300)];

var alpha;
var beta;
var gamma;
var inX;
var inY;

printAngle(points[0], points[1], points[2]);
findIncenter(points[0], points[1], points[2]);

document.addEventListener("mousedown", mouseDown);

document.addEventListener('keydown', function(e) {
  if (e.key = "Q") {
    console.log("Error logged");
    window.cancelAnimationFrame(id);
  }
});

gameLoop();

var j = 0;
function gameLoop(){
  //console.log(++j);
  id = window.requestAnimationFrame(gameLoop);
  tick();
}

function mouseDown(e) {
  var i;
  for (i = 0; i < points.length; i++) {
    if (points[i].drag(e.offsetX, e.offsetY)) {
      document.addEventListener("mousemove", mouseDrag);
      currentPoint = points[i];
    }
  }
}

function mouseDrag(e) {
  currentPoint.setPos(e.offsetX, e.offsetY);
  document.addEventListener("mouseup", mouseUp);
  printAngle(points[0], points[1], points[2]);
  findIncenter(points[0], points[1], points[2]);
}

function mouseUp(e) {
  document.removeEventListener("mousemove", mouseDrag);
}

function tick() {
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, 800, 600);

  drawTriangle();
  drawPoints();
  drawAngles();
  drawCornerLine();
}

function lengthSquare(p1, p2) {
  return Math.pow(p1.xPos - p2.xPos, 2) + Math.pow(p1.yPos - p2.yPos, 2);
}

function printAngle(A, B, C) {
  var a2 = lengthSquare(B, C);
  var b2 = lengthSquare(A, C);
  var c2 = lengthSquare(A, B);

  var a = Math.sqrt(a2);
  var b = Math.sqrt(b2);
  var c = Math.sqrt(c2);

  alpha = Math.acos((b2 + c2 - a2) / (2 * b * c));
  beta = Math.acos((a2 + c2 - b2) / (2 * a * c));2

  alpha = Math.round(alpha * 180 / Math.PI);
  beta = Math.round(beta * 180 / Math.PI);
  gamma = (180 - (alpha + beta));

  if (alpha + beta == 1) {
    alpha = 0;
    beta = 0;
    gamma = 180;
  }
  if (gamma + beta == 1) {
    gamma = 0;
    beta = 0;
    alpha = 180;
  }
  if (gamma + alpha == 1) {
    gamma = 0;
    alpha = 0;
    beta = 180;
  }
}

function findIncenter(A, B, C) {
  var lenX = Math.sqrt(lengthSquare(B, C));
  var lenY = Math.sqrt(lengthSquare(C, A));
  var lenZ = Math.sqrt(lengthSquare(A, B));

  inX = (lenX * A.xPos + lenY * B.xPos + lenZ * C.xPos) / (lenX + lenY + lenZ);
  inY = (lenX * A.yPos + lenY * B.yPos + lenZ * C.yPos) / (lenX + lenY + lenZ);
}

function findTextOffset(A) {
  var opp = inY - A.yPos;
  var adj = inX - A.xPos;

  var angle;

  if (opp >= 0 && adj >= 0) {
    angle = Math.atan(opp / adj);
  } else if (opp > 0 && adj < 0) {
    angle = Math.atan(opp / adj) + Math.PI;
  } else if (opp < 0 && adj > 0) {
    angle = Math.atan(opp / adj);
  } else if (opp < 0 && adj < 0) {
    angle = Math.atan(opp / adj) + Math.PI;
  }

  var yOff = Math.sin(angle) * 25;
  var xOff = Math.cos(angle) * 25;

  return [xOff, yOff];
}

function drawTriangle() {
  ctx.strokeStyle = "rgba(150, 0, 0, 1)";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(points[0].xPos, points[0].yPos);
  ctx.lineTo(points[1].xPos, points[1].yPos);
  ctx.lineTo(points[2].xPos, points[2].yPos);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 0, 0, 1)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(points[0].xPos, points[0].yPos);
  ctx.lineTo(points[1].xPos, points[1].yPos);
  ctx.lineTo(points[2].xPos, points[2].yPos);
  ctx.closePath();
  ctx.stroke();
}

function drawPoints() {
  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  points[0].draw(ctx);
  points[1].draw(ctx);
  points[2].draw(ctx);
}

function drawAngles() {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  var offsetA = findTextOffset(points[0]);
  var offsetB = findTextOffset(points[1]);
  var offsetC = findTextOffset(points[2]);

  ctx.fillStyle = "#FFA500";

  ctx.fillText(alpha + "˚", points[0].xPos - offsetA[0], points[0].yPos - offsetA[1] + 10);
  ctx.fillText(beta + "˚", points[1].xPos - offsetB[0], points[1].yPos - offsetB[1] + 10);
  ctx.fillText(gamma + "˚", points[2].xPos - offsetC[0], points[2].yPos - offsetC[1] + 10);

  ctx.beginPath();
  ctx.arc(inX, inY, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawCornerLine() {
  ctx.strokeStyle = "rgb(0, 100, 255)";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(300, 500);
  ctx.lineTo(500, 500);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.lineTo(400 - Math.cos(alpha * Math.PI / 180) * 100, 500 - Math.sin(alpha * Math.PI / 180) * 100);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.lineTo(400 + Math.cos(gamma * Math.PI / 180) * 100, 500 - Math.sin(gamma * Math.PI / 180) * 100);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgb(0, 200, 255)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 500);
  ctx.lineTo(500, 500);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.lineTo(400 - Math.cos(alpha * Math.PI / 180) * 100, 500 - Math.sin(alpha * Math.PI / 180) * 100);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.lineTo(400 + Math.cos(gamma * Math.PI / 180) * 100, 500 - Math.sin(gamma * Math.PI / 180) * 100);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "rgb(0, 100, 255)";
  ctx.beginPath();
  ctx.arc(400, 500, 5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#FFA500";

  var aDist = 125 * (angleToDist(alpha));
  var bDist = 125 * (angleToDist(beta));
  var cDist = 125 * (angleToDist(gamma));

  ctx.fillText(alpha + "˚", 400 - Math.cos(alpha * Math.PI / 360) * aDist, 500 - Math.sin(alpha * Math.PI / 360) * aDist + 7.5);

  ctx.fillText(beta + "˚", 400 - Math.cos((alpha + beta/2) * Math.PI / 180) * bDist, 500 - Math.sin((alpha + beta/2) * Math.PI / 180) * bDist + 7.5);

  ctx.fillText(gamma + "˚", 400 + Math.cos(gamma * Math.PI / 360) * cDist, 500 - Math.sin(gamma * Math.PI / 360) * cDist + 7.5);

  ctx.font = "30px Arial";
  ctx.fillStyle = "#FFA500";
  ctx.fillText(alpha + "˚ + " + beta + "˚ + " + gamma + "˚ = 180˚", 400, 565);
}

function angleToDist(a) {
  if (a < 150) {
    return (1 - a / 180);
  } else {
    return (1 / 6)
  }
}