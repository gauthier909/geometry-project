class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

function setup() {
    canvas = createCanvas(windowWidth, 400);

    input1 = createInput();
    input1.position(30, 280);

    input2 = createInput();
    input2.position(input1.x + input1.width, input1.y);

    input3 = createInput();
    input3.position(input2.x + input2.width, input2.y);
}

  
function draw() {
    // Put drawings here
    background(200);

    text("Radius 1", input1.x + 50, 20); //70 20
    text("Radius 2", input2.x + 50, 20);  //230 20
    text("Radius 3", input3.x + 50, 20); //390 20
    
    const p1 = new Point(windowWidth/2 - (500/6), 
    250 + ((500/6)/Math.sin(Math.PI/3))*Math.sin(Math.PI/6));
    const p2 = new Point(p1.x + 500/3, p1.y);
    const p3 = new Point(windowWidth/2, p1.y - ((500/6)/Math.sin(PI/6))*Math.sin(PI/3));
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    let radius = int(input1.value());
    let center = findCenter(p1, p2, radius, "up", "up");
    let angle1 = findAngle(center, p1, radius);
    let angle2 = findAngle(center, p2, radius);
    drawArc(center, angle1, angle2, p1, p2, radius);

    radius = int(input2.value());
    center = findCenter(p2, p3, radius, "left", "down");
    angle1 = findAngle(center, p2, radius);
    angle2 = findAngle(center, p3, radius);
    drawArc(center, angle1, angle2, p2, p3, radius);

    radius = int(input3.value());
    center = findCenter(p1, p3, radius, "right", "down");
    angle1 = findAngle(center, p1, radius);
    angle2 = findAngle(center, p3, radius);
    drawArc(center, angle1, angle2, p1, p3, radius);
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