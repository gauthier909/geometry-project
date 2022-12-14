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

class Edge {
    constructor(a, b, p1, p2) {
        this.a = a;
        this.b = b;
        this.p1 = p1;
        this.p2 = p2;
        this.x1 = null;
        this.y1 = null;
        this.x2 = null;
        this.y2 = null;
    }

    setIntersect1(x, y) {
        this.x1 = x;
        this.y1 = y
    }

    setIntersect2(x, y) {
        this.x2 = x;
        this.y2 = y
    }
}

var convexHull = [];
var sorted = []; //CH sorted clockwise
var points = [];
var lines = [];
var circles = [];
var edges = [];
var CH_is_sorted = false;
var showCenter = false;
var leftMostPoint;
var fpvd = false;
var fpvd_2 = true;


function setup() {
    createCanvas(windowWidth, 700);

    button = createButton('Add random point');
    
    button.mousePressed(randomPoint);

    button2 = createButton('Draw CH');

    button2.mousePressed(drawCH);

    button3 = createButton('Smallest circle');

    button3.mousePressed(smallestCircle);

    button4 = createButton('FPVD');

    button4.mousePressed(Construct_FPVD);

    button5 = createButton('Clear');

    button5.mousePressed(clear_all);

    //button.position(1000, 900);
    //button2.position(1150, 900);
    //button3.position(1250, 900);
    //button4.position(1400, 900);
}

function Construct_FPVD() {
    if (fpvd == false) {
        fpvd = true;
    } else {
        fpvd = false;
    }
}

function clear_all() {
    convexHull = [];
    sorted = [];
    points = [];
    lines = [];
    circles = [];
    edges = [];
    CH_is_sorted = false;
    showCenter = false;
    fpvd = false;
    fpvd_2 = true;
}


function draw() {

    background(200);

    for (i in points) {
        ellipse(points[i].x, points[i].y, 4, 4);
    }

    for (i in lines) {
        line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
    for (i in circles) {
        circle(circles[i].x, circles[i].y, circles[i].r);
        fill(255, 0, 0, 127);
    }

    if (showCenter){
        ellipse(circles[0].x,circles[0].y,10,10)
    }

    if (fpvd && showCenter) {
        if (fpvd_2 == true) {
            FPVD();
        }
        for (let i = 0; i < edges.length; i++) {
            line(edges[i].x1, edges[i].y1, edges[i].x2, edges[i].y2);
        }
        fpvd_2 = false;
    }

}

/*Add random point in the canva*/
function randomPoint() {
    let width = Math.floor(Math.random() * 300) + 400;
    let height = Math.floor(Math.random() * 300) + 200;
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
}

/*Convex function to compute CH*/
/*https://gist.github.com/globalpolicy/12aa0e11fd737037a5e9be6e97ee474e*/
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

/*Add every points of the CH in the convexHull [] array*/
function addInConvexHull(point1, point2) {
    if (!convexHull.some((e) => (e.x === point1.x && e.y === point1.y))) {
        convexHull.push(point1);
    }
    if (!convexHull.some((e) => (e.x === point2.x && e.y === point2.y))) {
        convexHull.push(point2);
    }

}

/*Order CH points clockwise*/
function classifyClockWise() {
    convexHull.sort((p1, p2) => p1.x - p2.x);
    leftMostPoint = convexHull[0];
    var current = leftMostPoint;
    sorted.push(current);
    let minY = 1000;
    var nextPoint;
    for (l in lines) {
        if (lines[l].x1 === current.x && lines[l].y1 === current.y) {
            if (lines[l].y2 < minY) {
                nextPoint = new Point(lines[l].x2, lines[l].y2);
                minY = lines[l].y2;
            }
        }
        if (lines[l].x2 === current.x && lines[l].y2 === current.y) {
            if (lines[l].y1 < minY) {
                nextPoint = new Point(lines[l].x1, lines[l].y1);
                minY = lines[l].y1;
            }
        }

    }
    sorted.push(nextPoint);
    current = nextPoint;
    while(sorted.length !== convexHull.length) {
        for(l in lines){
            if (lines[l].x1 === current.x && lines[l].y1 === current.y) {
                if (!sorted.some((e) => (e.x === lines[l].x2 && e.y === lines[l].y2))) {
                    let p = new Point( lines[l].x2, lines[l].y2);
                    sorted.push(p);
                    current = p;
              }
            }
            if (lines[l].x2 === current.x && lines[l].y2 === current.y) {
                if (!sorted.some((e) => (e.x === lines[l].x1 && e.y === lines[l].y1))) {
                    let p = new Point( lines[l].x1, lines[l].y1);
                    sorted.push(p);
                    current = p;
              }
            }
        }
    }
    CH_is_sorted = true;
}

/*Compute the smallest circle*/
function smallestCircle() {
    const result = (welzl(convexHull, convexHull.length, [], 0));
    let smallestCircle = new Circle(result.x, result.y, result.r * 2);
    circles.push(smallestCircle);
    showCenter = true;
}


/*Welzl's algorithm for smallest circle*/
/*https://github.com/rowanwins/smallest-enclosing-circle/blob/master/src/main.js*/
function welzl(convexHull, nbrPoints, bound, b) {
    let circle;
    if (b === 3) circle = check3(bound[0], bound[1], bound[2])
    else if (nbrPoints === 1 && b === 0) circle = { x: convexHull[0].x, y: convexHull[0].y, r: 0 }
    else if (nbrPoints === 0 && b === 2) circle = check2(bound[0], bound[1])
    else if (nbrPoints === 1 && b === 1) circle = check2(bound[0], convexHull[0])
    else {
        circle = welzl(convexHull, nbrPoints - 1, bound, b)
        if (!inCircle(convexHull[nbrPoints - 1], circle)) {
            bound[b++] = convexHull[nbrPoints - 1]
            circle = welzl(convexHull, nbrPoints - 1, bound, b)
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

//compute the farthest point voronoi diagram
function FPVD() {
    edges = [];
    if (CH_is_sorted == false) {
        classifyClockWise();
    }
    let boundary_points = boundary(sorted);
    let infinity_0 = true;
    let circle_flag = false;
    if (boundary_points.length > 2) {
        circle_flag = true;
        infinity_0 = false;
    }
    FPVD_tree(boundary_points, sorted, circle_flag);
    infinity_line(infinity_0);
}

//compute the points of the convex hull that are located at the boundary of the smallest enclosing circle
function boundary(ch) {
    let res = [];
    for (let i = 0; i < ch.length; i++) {
        let tmp = (ch[i].x - circles[0].x)**2 + (ch[i].y - circles[0].y)**2;
        if (tmp < (circles[0].r/2)**2 + 0.1 && tmp > (circles[0].r/2)**2 - 0.1) {
            res.push(ch[i]);
        }
    }
    return res;
}

//Create an edge of the farthest point voronoi diagram
function createEdge(p1, p2, c) {
    let a = p2.y - p1.y;
    let b = p1.x - p2.x;
    a = a*(-1)/b;
    a = (-1)*(a**(-1));
    b = c.y - a*c.x;
    let edge = new Edge(a, b, p1, p2);
    edges.push(edge);
}

//Root function for the construction of the tree of the farthest point voronoi diagram
function FPVD_tree(p_list, ch, c) {
    let flag = true;
    let res = [];
    let part = [];
    let index = 0;
    let swap_edge_points = false;

    for (let i = 0; i < ch.length; i++) {
        if (p_list.length > 1 && ch[i].x == p_list[index].x && ch[i].y == p_list[index].y) {
            if (flag == true) {
                createEdge(p_list[p_list.length-1], p_list[0], circles[0]);
                flag = false;
                index = 1;
                if (c == false) {
                    p_list.splice(0, 1);
                    swap_edge_points = true;
                }
            } else {
                createEdge(p_list[0], p_list[1], circles[0]);
                p_list.splice(0, 1);
            }
            if (c == true) {
                edges[edges.length-1].setIntersect1(circles[0].x, circles[0].y);
            }
            res.push([part, edges[edges.length-1], edges.length-1, false]);
            part = [];
        } else if (ch[i] != p_list[0]) {
            part.push(ch[i]);
        } else if (c == false && part.length > 0) {
            res.push([part, edges[edges.length-1], edges.length-1, swap_edge_points]);
            part = [];
        }
    }
    if (part != []) {
        res[0][0] = part.concat(res[0][0]);
    }
    for (let i = 0; i < res.length; i++) {
        FPVD_subtree(res[i]);
    }
}

//construction of a subtree of the farthest point voronoi diagram
function FPVD_subtree(l) {

    let tmp_point;

    if (l[0].length > 0) {
        let min_dist = Infinity;
        let best_point = null;
        let index = 0;
        for (let i = 0; i < l[0].length; i++) {
            let dist = dist_point_edge(l[0][i], l[1])
            if (dist < min_dist) {
                min_dist = dist;
                best_point = l[0][i];
                index = i;
            }
        }
        if (l[3] == true) {
            tmp_point = new Point((l[1].p2.x + best_point.x)/2, (l[1].p2.y + best_point.y)/2);
            createEdge(l[1].p2, best_point, tmp_point);
        } else {
            tmp_point = new Point((l[1].p1.x + best_point.x)/2, (l[1].p1.y + best_point.y)/2);
            createEdge(l[1].p1, best_point, tmp_point);
        }
        Intersect(edges[edges.length-1], l[1], l[2]);
        let part = l[0].slice(0, index);
        FPVD_subtree([part, edges[edges.length-1], edges.length-1, false]);
        if (l[3] == true) {
            tmp_point = new Point((l[1].p1.x + best_point.x)/2, (l[1].p1.y + best_point.y)/2);
            createEdge(best_point, l[1].p1, tmp_point);
        } else {
            tmp_point = new Point((l[1].p2.x + best_point.x)/2, (l[1].p2.y + best_point.y)/2);
            createEdge(best_point, l[1].p2, tmp_point);
        }
        Intersect(edges[edges.length-1], l[1], l[2]);
        part = l[0].slice(index+1);
        FPVD_subtree([part, edges[edges.length-1], edges.length-1, false]);
    }
}

//determine the next branch of the tree of the farthest point voronoi diagram
function dist_point_edge(p, e) {
    let a = e.p1.y - p.y;
    let b = p.x - e.p1.x;
    a = a*(-1)/b;
    a = (-1)*(a**(-1));
    b = (p.y + e.p1.y)/2 - a*(p.x + e.p1.x)/2;
    let x = (b - e.b)/(e.a - a);
    let y = a*x + b;
    let x2 = (e.p1.x + e.p2.x)/2;
    let y2 = (e.p1.y + e.p2.y)/2;
    return  Math.sqrt((x2 - x)**2 + (y2 - y)**2);
}

//Compute the intersection (vertex of FPVD) of 2 edges of the farthest point voronoi diagram
function Intersect(e1, e2, index) {
    let x = (e1.b - e2.b)/(e2.a - e1.a);
    intersect = new Point(x, e1.a*x + e1.b);
    if (e1.x1 == null) {
        e1.setIntersect1(intersect.x, intersect.y);
    } else if (!(e1.x1 < intersect.x + 0.1 && e1.x1 > intersect.x -0.1 
        && e1.y1 < intersect.y + 0.1 && e1.y1 > intersect.y -0.1)) {
        e1.setIntersect2(intersect.x, intersect.y);
    }
    if (e2.x1 == null) {
        e2.setIntersect1(intersect.x, intersect.y);
        edges[index] = e2;
    } else if (!(e2.x1 < intersect.x + 0.1 && e2.x1 > intersect.x -0.1 
        && e2.y1 < intersect.y + 0.1 && e2.y1 > intersect.y -0.1)) {
        e2.setIntersect2(intersect.x, intersect.y);
        edges[index] = e2;
    }
}

//make the leaves of the tree of the farthest point voronoi diagram points at infinity
function infinity_line(infinity_0) {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].x2 == null){
            if ((edges[i].p1.x + edges[i].p2.x)/2 > edges[i].x1) {
                if (i != 0 || infinity_0 == false) {
                    edges[i].x2 = -9999;
                } else {
                    edges[i].x2 = 9999;
                }
                edges[i].y2 = edges[i].a*(edges[i].x2) + edges[i].b;
            } else if ((edges[i].p1.x + edges[i].p2.x)/2 < edges[i].x1) {
                if (i != 0 || infinity_0 == false) {
                    edges[i].x2 = 9999;
                } else {
                    edges[i].x2 = -9999;
                }
                edges[i].y2 = edges[i].a*edges[i].x2 + edges[i].b;
            } else if ((edges[i].p1.y + edges[i].p2.y)/2 > edges[i].y1) {
                if (i != 0 || infinity_0 == false) {
                    edges[i].x2 = -9999;
                } else {
                    edges[i].x2 = 9999;
                }
                edges[i].x2 = ((edges[i].x2) - edges[i].b)/edges[i].a;
            } else if ((edges[i].p1.y + edges[i].p2.y)/2 < edges[i].y1) {
                if (i != 0 || infinity_0 == false) {
                    edges[i].x2 = 9999;
                } else {
                    edges[i].x2 = -9999;
                }
                edges[i].x2 = (edges[i].x2  - edges[i].b)/edges[i].a;
            } 
        }
    }
}

windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
