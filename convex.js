var Step1flag = false;
var Step2flag = false;
var Step3flag = false;
var Step4flag = false;
    
class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

function setup() {
    createCanvas(windowWidth, 400);

    button = createButton('Step 1');
    button.position(30, 240);
    button.mousePressed(Step1);

    button2 = createButton('Step 2');
    button2.position(button.x + button.width, 240);
    button2.mousePressed(Step2);

    button3 = createButton('Step 3');
    button3.position(button2.x + button2.width, 240);
    button3.mousePressed(Step3);

    button4 = createButton('Step 4');
    button4.position(button3.x + button3.width, 240);
    button4.mousePressed(Step4);
}

function Step1() {
    if (Step1flag == true) {
        Step1flag = false;
    } else {
        Step1flag = true;
        Step2flag = false;
        Step3flag = false;
        Step4flag = false;
    }
}

function Step2() {
    if (Step2flag == true) {
        Step2flag = false;
    } else {
        Step1flag = false;
        Step2flag = true;
        Step3flag = false;
        Step4flag = false;
    }
}

function Step3() {
    if (Step3flag == true) {
        Step3flag = false;
    } else {
        Step1flag = false;
        Step2flag = false;
        Step3flag = true;
        Step4flag = false;
    }
}

function Step4() {
    if (Step4flag == true) {
        Step4flag = false;
    } else {
        Step1flag = false;
        Step2flag = false;
        Step3flag = false;
        Step4flag = true;
    }
}

  
function draw() {
    // Put drawings here
    background(200);
    
    if (Step1flag == true || Step2flag == true || Step3flag == true || Step4flag == true) {
        const width = windowWidth/2 - 50
        let x = 50;
        if (Step1flag == false) {
            x = -50;
        }
        let p1;
        if (Step3flag == true || Step4flag == true) {
            p1 = new Point(width - 50, 225);
        } else {
            p1 = new Point(width, 250);
        } 

        const p2 = new Point(width, 200);
        const p3 = new Point(width + 150, 200);
        const p4 = new Point(width + 150, 350);
        const p5 = new Point(width, 350);

        let p6;
        if (Step4flag == true) {
            p6 = new Point(width - 50, 325);
        } else {
            p6 = new Point(width, 300);
        } 

        const p7 = new Point(width + x, 275);
        line(p1.x, p1.y, p2.x, p2.y);
        line(p2.x, p2.y, p3.x, p3.y);
        line(p3.x, p3.y, p4.x, p4.y);
        line(p4.x, p4.y, p5.x, p5.y);
        line(p5.x, p5.y, p6.x, p6.y);
        line(p6.x, p6.y, p7.x, p7.y);
        line(p7.x, p7.y, p1.x, p1.y);
    }
}
  
  // This Redraws the Canvas when resized
  windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
  };