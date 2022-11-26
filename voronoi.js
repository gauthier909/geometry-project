
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

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

var convexHull = []; //Ici je regroupe les points du convex hull vu que ce sont les seuls qui nous intéresse
var points = [];
var lines = [];
var circles = [];
var showCenter = false;


function setup() {
    createCanvas(1000, 700);

    button = createButton('Add random point');

    button.mousePressed(randomPoint);

    button2 = createButton('Draw CH');

    button2.mousePressed(drawCH);

    button3 = createButton('Smallest circle');

    button3.mousePressed(smallestCircle);

    button.position(1000, 900);
    button2.position(1150, 900);
    button3.position(1250, 900);
}


function draw() {

    background(200);
    for (i in points) {
        ellipse(points[i].x, points[i].y, 4, 4);
    }

    /*Show lines of the convex hull*/
    for (i in lines) {
        line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
    for (i in circles) {
        circle(circles[i].x, circles[i].y, circles[i].r);
        fill(255, 0, 0, 127);
    }

    /*Show the center of the smallest circle*/
    if(showCenter){
        ellipse(circles[0].x,circles[0].y,10,10)
    }

}

/*Add random point in the canva*/
function randomPoint() {
    let width = Math.floor(Math.random() * 501);
    let height = Math.floor(Math.random() * 501);
    let p = new Point(width, height);
    points.push(p);
}


/*compute the convex hull*/
function drawCH() {
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i] != points[j]) {
                if (isSegmentConvex(points[i], points[j], points)) {
                    let l = new Line(points[i].x, points[i].y, points[j].x, points[j].y);
                    lines.push(l);
                    addInConvexHull(points[i], points[j]);
                }
            }
        }
    }
    console.log(convexHull);
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

/*Ici j'ajoute tout les points du convex hull dans le tableau convexHull []*/
function addInConvexHull(point1, point2) {
    if (!convexHull.some((e) => (e.x === point1.x && e.y === point1.y))) {
        convexHull.push(point1);
    }
    if (!convexHull.some((e) => (e.x === point2.x && e.y === point2.y))) {
        convexHull.push(point2);
    }

}

/*Calcul du plus petit cercle*/
function smallestCircle() {
    const result = (weltz(convexHull, convexHull.length, [], 0));
    let smallestCircle = new Circle(result.x, result.y, result.r * 2);
    circles.push(smallestCircle);
    showCenter = true;
}

/*Algorithme de weltz qui permet de trouver le plus petit cercle*/
function weltz(convexHull, nbrPoints, bound, b) {
    let circle;
    if (b === 3) circle = check3(bound[0], bound[1], bound[2])
    else if (nbrPoints === 1 && b === 0) circle = { x: convexHull[0].x, y: convexHull[0].y, r: 0 }
    else if (nbrPoints === 0 && b === 2) circle = check2(bound[0], bound[1])
    else if (nbrPoints === 1 && b === 1) circle = check2(bound[0], convexHull[0])
    else {
        circle = weltz(convexHull, nbrPoints - 1, bound, b)
        if (!inCircle(convexHull[nbrPoints - 1], circle)) {
            bound[b++] = convexHull[nbrPoints - 1]
            circle = weltz(convexHull, nbrPoints - 1, bound, b)
        }
    }
    return circle;
}


function check3(p1, p2, p3) {
    let
        a = p2.x - p1.x,
        b = p2.y - p1.y,
        c = p3.x - p1.x,
        d = p3.y - p1.y,
        e = a * (p2.x + p1.x) * 0.5 + b * (p2.y + p1.y) * 0.5,
        f = c * (p3.x + p1.x) * 0.5 + d * (p3.y + p1.y) * 0.5,
        det = a * d - b * c,
        cx = (d * e - b * f) / det,
        cy = (-c * e + a * f) / det

    return { x: cx, y: cy, r: Math.sqrt((p1.x - cx) * (p1.x - cx) + (p1.y - cy) * (p1.y - cy)) }
}

function check2(p1, p2) {
    let
        cx = 0.5 * (p1.x + p2.x),
        cy = 0.5 * (p1.y + p2.y)

    return { x: cx, y: cy, r: Math.sqrt((p1.x - cx) * (p1.x - cx) + (p1.y - cy) * (p1.y - cy)) }
}

function inCircle(p, c) {
    return ((c.x - p.x) * (c.x - p.x) + (c.y - p.y) * (c.y - p.y) <= c.r * c.r)
}

windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};