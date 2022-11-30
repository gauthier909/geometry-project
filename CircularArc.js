var Swapflag = false;

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

function setup() {
    canvas = createCanvas(windowWidth, 400);

    input1 = createInput();

    input2 = createInput();

    input3 = createInput();

    button = createButton('Swap');

    button.mousePressed(Swap);
}

function Swap() {
    if (Swapflag == true) {
        Swapflag = false;
    } else {
        Swapflag = true;
    }
}
  
function draw() {

    background(200);

    text("Radius 1", 50, 390); 
    text("Radius 2", 225, 390);  
    text("Radius 3", 400, 390); 
    
    const p1 = new Point(windowWidth/2 - (500/6), 
    250 + ((500/6)/Math.sin(Math.PI/3))*Math.sin(Math.PI/6));
    const p2 = new Point(p1.x + 500/3, p1.y);
    const p3 = new Point(windowWidth/2, p1.y - ((500/6)/Math.sin(PI/6))*Math.sin(PI/3));
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    let radius_1 = int(input1.value());
    let center_1 = findCenter(p1, p2, radius_1, "up", "up");
    let angle1_1 = findAngle(center_1, p1, radius_1);
    let angle2_1 = findAngle(center_1, p2, radius_1);
    drawArc(center_1, angle1_1, angle2_1, p1, p2, radius_1);
    let point1 = new Point((p1.x + (p2.x - p1.x)/3), findY(center_1, radius_1, (p1.x + (p2.x - p1.x)/3), false));
    let point2 = new Point((p1.x + 2*(p2.x - p1.x)/3), findY(center_1, radius_1, (p1.x + 2*(p2.x - p1.x)/3), false));
    let radius_2 = int(input2.value());
    let center_2 = findCenter(p2, p3, radius_2, "left", "down");
    let angle1_2 = findAngle(center_2, p2, radius_2);
    let angle2_2 = findAngle(center_2, p3, radius_2);
    drawArc(center_2, angle1_2, angle2_2, p2, p3, radius_2);
    let point3 = new Point(findX(center_2, radius_2, p3.y + (p2.y - p3.y)/3, true), p3.y + (p2.y - p3.y)/3);
    let point4 = new Point(findX(center_2, radius_2, p3.y + 2*(p2.y - p3.y)/3, true), p3.y + 2*(p2.y - p3.y)/3);
    let radius_3 = int(input3.value());
    let center_3 = findCenter(p1, p3, radius_3, "right", "down");
    let angle1_3 = findAngle(center_3, p1, radius_3);
    let angle2_3 = findAngle(center_3, p3, radius_3);
    drawArc(center_3, angle1_3, angle2_3, p1, p3, radius_3);
    let point5 = new Point(findX(center_3, radius_3, p3.y + (p1.y - p3.y)/3, false), p3.y + (p1.y - p3.y)/3);
    let point6 = new Point(findX(center_3, radius_3, p3.y + 2*(p1.y - p3.y)/3, false), p3.y + 2*(p1.y - p3.y)/3);
    if (Swapflag == true) {
        center_1 = findCenter(point1, point2, radius_3, "up", "up");
        angle1_1 = findAngle(center_1, point1, radius_3);
        angle2_1 = findAngle(center_1, point2, radius_3);
        drawArc(center_1, angle1_1, angle2_1, point1, point2, radius_3);

        center_1 = findCenter(point3, point4, radius_1, "left", "down");
        angle1_1 = findAngle(center_1, point3, radius_1);
        angle2_1 = findAngle(center_1, point4, radius_1);
        drawArc(center_1, angle1_1, angle2_1, point3, point4, radius_1);

        center_1 = findCenter(point5, point6, radius_2, "right", "down");
        angle1_1 = findAngle(center_1, point5, radius_2);
        angle2_1 = findAngle(center_1, point6, radius_2);
        drawArc(center_1, angle1_1, angle2_1, point5, point6, radius_2);
    }
}
  
  // This Redraws the Canvas when resized
  windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
  };


//https://stackoverflow.com/questions/36211171/finding-center-of-a-circle-given-two-points-and-radius
function findCenter(p1, p2, radius, str1, str2) {
    let q = findDist(p1, p2);
    let x = (p1.x + p2.x)/2;
    let y = (p1.y + p2.y)/2;
    let x_F = x + Math.sqrt(radius**2-(q/2)**2)*(p1.y-p2.y)/q;
    let y_F = y + Math.sqrt(radius**2-(q/2)**2)*(p2.x-p1.x)/q;

    if ((str1 == "left" && x_F > p1.x) || (str1 == "right" && x_F < p1.x) ||
    (str1 == "up" && y_F > p1.y) || (str1 == "down" && y_F < p1.y) ||
    (str2 == "left" && x_F > p2.x) || (str2 == "right" && x_F < p2.x) ||
    (str2 == "up" && y_F > p2.y) || (str2 == "down" && y_F < p2.y)) {
        let x_F_2 = x - Math.sqrt(radius**2-(q/2)**2)*(p1.y-p2.y)/q;
        let y_F_2 = y - Math.sqrt(radius**2-(q/2)**2)*(p2.x-p1.x)/q;

        if ((str1 == "left" && x_F > x_F_2) || (str1 == "right" && x_F < x_F_2) ||
        (str1 == "up" && y_F > y_F_2) || (str1 == "down" && y_F < y_F_2) ||
        (str2 == "left" && x_F > x_F_2) || (str2 == "right" && x_F < x_F_2) ||
        (str2 == "up" && y_F > y_F_2) || (str2 == "down" && y_F < y_F_2)) {
            x_F = x_F_2;
            y_F = y_F_2
        }
    }
    let center = new Point(x_F, y_F);
    return center;
}

function findDist(p1, p2) {
    let dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
    return dist;
}

//Cosine rule
function findAngle(center, p1, radius) {
    let dist_p1_center = findDist(p1, center);
    let p2 = new Point(center.x + radius, center.y);
    let dist_p1_p2 = findDist(p1, p2);
    let angle = Math.acos((2*dist_p1_center**2 - dist_p1_p2**2)/(2*dist_p1_center**2));
    return angle;
}

function drawArc(center, angle1, angle2, p1, p2, radius) {
    let f_angle1;
    let f_angle2;
    if (p1.y > center.y) {
        f_angle1 = angle1;
    } else {
        f_angle1 = 2*PI - angle1;
    }
    if (p2.y > center.y) {
        f_angle2 = angle2;
    } else {
        f_angle2 = 2*PI - angle2;
    }
    if ((f_angle1 > f_angle2 && (f_angle1 - f_angle2 > PI)) ||
    (f_angle1 < f_angle2 && (f_angle2 - f_angle1 < PI))) {
        arc(center.x, center.y, radius*2, radius*2, f_angle1, f_angle2, OPEN);
    } else {
        arc(center.x, center.y, radius*2, radius*2, f_angle2, f_angle1, OPEN);
    }
}

function findX(center, radius, y, plus) {
    let x = Math.sqrt(radius**2 - (y - center.y)**2) + center.x;
    if (plus == false) {
        x = 2*center.x - x;
    }
    return x;
}

function findY(center, radius, x, plus) {
    let y = Math.sqrt(radius**2 - (x - center.x)**2) + center.y;
    if (plus == false) {
        y = 2*center.y - y;
    }
    if (y > center.y) {
        y = y - 2*(y - center.y);
    } else {
        y = y + 2*(center.y - y);
    }
    return y;
}
