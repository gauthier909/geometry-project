
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}


var convexHull = [];
var points = [];
var lines = [];


function setup() {
    createCanvas(700, 400);

    button = createButton('Add random point');

    button.mousePressed(randomPoint);

    button2 = createButton('Draw CH');

    button2.mousePressed(drawCH);

    button3 = createButton('Smallest circle');

    button3.mousePressed(smallestCircle);

    button.position(30, 600);
    button2.position(200, 600);
    button3.position(300, 600);
}


function draw() {
    // Put drawings here
    background(200);
    for (i in points) {
        ellipse(points[i].x, points[i].y, 4, 4);
    }

    for (i in lines) {
        line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }



}

function randomPoint() {
    let width = Math.floor(Math.random() * 701);
    let height = Math.floor(Math.random() * 401);
    let p = new Point(width, height);
    points.push(p);
}


windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};




function drawCH() {
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i] != points[j]) {
                if (isSegmentConvex(points[i], points[j], points)) {
                    let l = new Line(points[i].x, points[i].y, points[j].x, points[j].y);
                    lines.push(l);
                    addInConvexHull(points[i],points[j]);
                }
            }
        }
    }
}

function isSegmentConvex(point1, point2, points) {
    let side = null;
    for (const point of points) {
        if (point != point1 && point != point2) {
            let d = (point.x - point1.x) * (point2.y - point1.y) - (point.y - point1.y) * (point2.x - point1.x);
            if (side == null) {
                side = d;
            }
            if (d * side < 0) {
                return false;
            }
        }
    }
    return true;
}

function addInConvexHull(point1,point2){

}

function smallestCircle(){

}