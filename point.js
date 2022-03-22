class Point {
  constructor(xP, yP) {
    this.xPos = xP;
    this.yPos = yP;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  setPos(x, y) {
    this.xPos = x;
    this.yPos = y;
  }

  drag(mouseX, mouseY) {
    if (this.checkDistance(mouseX, mouseY)) {
      return true;
    }
  }

  checkDistance(mouseX, mouseY) {
    var distance = Math.sqrt(Math.pow(this.xPos - mouseX, 2) + Math.pow(this.yPos - mouseY, 2));
    if (distance < 15) {
      return true;
    } else {
      return false;
    }
  }
}

