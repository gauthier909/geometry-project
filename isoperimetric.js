var triangleflag = false;
var squareflag = false;
var circleflag = false;
    
class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

function setup() {
    createCanvas(windowWidth, 400);
  
    input = createInput();
    input.position(30, 200);

    button = createButton('triangle');
    button.position(input.x + input.width, 200);
    button.mousePressed(setTriangle);

    button2 = createButton('square');
    button2.position(button.x + button.width, 200);
    button2.mousePressed(setSquare);

    button3 = createButton('circle');
    button3.position(button2.x + button2.width, 200);
    button3.mousePressed(setCircle);
}

function setTriangle() {
    if (triangleflag == true) {
        triangleflag = false;
    } else {
        triangleflag = true;
    }
}

function setSquare() {
    if (squareflag == true) {
        squareflag = false;
    } else {
        squareflag = true;
    }
}

function setCircle() {
    if (circleflag == true) {
        circleflag = false;
    } else {
        circleflag = true;
    }
}

  
function draw() {
    // Put drawings here
    background(200);
    
    if (triangleflag == true) {
        const p1 = new Point(windowWidth/2 - int(input.value()/6), 
        250 + ((int(input.value()/6))/Math.sin(Math.PI/3))*Math.sin(Math.PI/6));
        const p2 = new Point(p1.x + int(input.value()/3), p1.y);
        const p3 = new Point(windowWidth/2, 
        p1.y - ((int(input.value()/6))/Math.sin(Math.PI/6))*Math.sin(Math.PI/3));
        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    }

    if (squareflag == true) {
        square(windowWidth/2 - int(input.value()/8), 250 - int(input.value()/8),
         int(input.value()/4));
    }

    if (circleflag == true) {
        circle(windowWidth/2, 250,int(input.value()/Math.PI));
    }
}
  
  // This Redraws the Canvas when resized
  windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
  };