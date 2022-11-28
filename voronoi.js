
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

var convexHull = []; //Ici je regroupe les points du convex hull vu que ce sont les seuls qui nous intéresse
var sorted = []; //CH sorted clockwise
var points = [];
var lines = [];
var circles = [];
var edges = [];
var showCenter = false;
var leftMostPoint;
var fpvd = false;



function setup() {
    createCanvas(1000, 700);

    button = createButton('Add random point');

    button.mousePressed(randomPoint);

    button2 = createButton('Draw CH');

    button2.mousePressed(drawCH);

    button3 = createButton('Smallest circle');

    button3.mousePressed(smallestCircle);

    button4 = createButton('FPVD');

    button4.mousePressed(Construct_FPVD);

    button.position(1000, 900);
    button2.position(1150, 900);
    button3.position(1250, 900);
    button4.position(1400, 900);
}

function Construct_FPVD() {
    if (fpvd == false) {
        fpvd = true;
    } else {
        fpvd = false;
    }
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
    if (showCenter) {
        ellipse(circles[0].x, circles[0].y, 10, 10)
    }

    if (fpvd == true) {
        FPVD();
        //console.log(edges.length);
        for (let i = 0; i < edges.length; i++) {
            line(edges[i].x1, edges[i].y1, edges[i].x2, edges[i].y2);
        }
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
    classifyClockWise();
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

function classifyClockWise() {
    // var sorted = [];
    // convexHull.sort((p1, p2) => p1.x - p2.x);
    // console.log(convexHull);
    // leftMostPoint = convexHull[0];
    // var copy = convexHull.slice();
    // var current = leftMostPoint;
    // sorted.push(current);
    // var connected;
    // for (var i = 1; i < convexHull.length; i++) {
    //     for (l in lines) {
    //         if (lines[l].x1 === current.x && lines[l].y1 === current.y) {
    //             let p = new Point(lines[l].x2, lines[l].y2);
    //             connected = p;
    //             if (checkNextConnectedPoint(current, connected)) {
    //                 if (!sorted.some((e) => (e.x === connected.x && e.y === connected.y))) {
    //                     sorted.push(connected);
    //                 }

    //             }
    //         }

    //         if (lines[l].x2 === current.x && lines[l].y2 === current.y) {
    //             let p = new Point(lines[l].x1, lines[l].y1);
    //             connected = p;
    //             if (checkNextConnectedPoint(current, connected)) {
    //                 if (!sorted.some((e) => (e.x === connected.x && e.y === connected.y))) {
    //                     sorted.push(connected);
    //                 }
    //             }
    //         }
    //     }
    //     current = convexHull[i]
    // }
    // console.log(sorted);

    convexHull.sort((p1, p2) => p1.x - p2.x);
    leftMostPoint = convexHull[0];
    var current = leftMostPoint;
    sorted.push(current);
    let minY = 1000;
    var nextPoint;
    for (l in lines) {
        if (lines[l].x1 === current.x && lines[l].y1 === current.y) {
            if (lines[l].y2 < minY) {
                nextPoint = { x: lines[l].x2, y: lines[l].y2 }
            }
        }
        if (lines[l].x2 === current.x && lines[l].y2 === current.y) {
            if (lines[l].y1 < minY) {
                nextPoint = { x: lines[l].x1, y: lines[l].y1 }
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
    console.log(convexHull)
    console.log(sorted)
}

// function checkNextConnectedPoint(current, connected) {
//     for (l in lines) {
//         if (lines[l].x1 === connected.x && lines[l].y1 === connected.y) {
//             if (!(lines[l].x2 === current.x && lines[l].y2 === current.y)) {
//                 let next = new Point(lines[l].x2, lines[l].y2);
//                 return calcRightOrientation(current, connected, next)
//             }

//         }

//         if (lines[l].x2 === connected.x && lines[l].y2 === connected.y) {
//             if (!(lines[l].x1 === current.x && lines[l].y1 === current.y)) {
//                 let next = new Point(lines[l].x1, lines[l].y1);
//                 return calcRightOrientation(current, connected, next)
//             }

//         }
//     }

// }

// function calcRightOrientation(p, q, r) {
//     let x1 = q.x - p.x;
//     let x2 = r.x - p.x;
//     let x3 = q.y - p.y;
//     let x4 = r.y - p.y;
//     let res = x1 * x4 - x2 * x3;
//     if (res > 0) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }


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

function FPVD() {
    let boundary_points = boundary();
    let circle_flag = false;
    if (boundary_points.length > 2) {
        circle_flag = true;
    }
    FPVD_tree(boundary_points, convexHull, circle_flag);
    infinity_line()
    /*
        while (boundary_points.length > 0) {
            let tmp_point = boundary_points[boundary_points.length-1];
            for (let i = 0; i < boundary_points.length-1; i++) {
                createEdge(boundary_points[i], tmp_point, circles[0]);
                if (len > 2) {
                    edges[edges.length-1].setIntersect1(circles[0].x, circles[0].y);
                }
                for (let j = 0; j < lines.length; j++) {
                    if ((lines[j].x1 == boundary_points[i].x && lines[j].y1 == boundary_points[i].y
                        && lines[j].x2 == tmp_point.x && lines[j].y2 == tmp_point.y) || 
                        (lines[j].x1 == tmp_point.x && lines[j].y1 == tmp_point.y
                            && lines[j].x2 == boundary_points[i].x && lines[j].y2 == boundary_points[i].y)) {
                                lines.splice(j, 1);
                                break;
                            }
                }
            }
            boundary_points.pop();
        }
    
        for (let i = 0; i < lines.length; i++) {
            let p1 = new Point(lines[i].x1, lines[i].y1);
            let p2 = new Point(lines[i].x2, lines[i].y2);
            createEdge(p1, p2, circles[0]);
        }
    
        infinity_line();
        */
}
/*
function CircleDist(x, y, c) {
    return c.r**2 - ((c.x - x)**2 + (c.y - y)**2);
}
*/
function boundary() {
    let res = [];
    for (let i = 0; i < convexHull.length; i++) {
        let tmp = (convexHull[i].x - circles[0].x) ** 2 + (convexHull[i].y - circles[0].y) ** 2;
        if (tmp < (circles[0].r / 2) ** 2 + 0.1 && tmp > (circles[0].r / 2) ** 2 - 0.1) {
            res.push(convexHull[i]);
        }
    }
    return res;
}

function createEdge(p1, p2, c) {
    let a = p2.y - p1.y;
    let b = p1.x - p2.x;
    let d = a * p1.x + b * p1.y;
    a = a * (-1) / b;
    b = d / b;
    a = (-1) * (a ** (-1));
    b = c.y - a * c.x;
    let edge = new Edge(a, b, p1, p2);
    edges.push(edge);
}

function FPVD_tree(p_list, ch, c) {
    let flag = true;
    let res = [];
    let part = [];

    for (let i = 0; i < ch.length; i++) {
        if (ch[i].x == p_list[0].x && ch[i].y == p_list[0].y) {
            if (flag == true) {
                createEdge(p_list[p_list.length - 1], p_list[0], circles[0]);
                flag = false;
            } else {
                createEdge(p_list[0], p_list[1], circles[0]);
                p_list.splice(0, 1);
            }
            if (c == true) {
                edges[edges.length - 1].setIntersect1(circles[0].x, circles[0].y);
            }
            res.push([part, edges[edges.length - 1]]);
            part = [];
        } else {
            part.push(ch[i]);
        }
    }
    if (part != []) {
        res[0][0] = part.concat(res[0][0]);
    }
    for (let i = 0; i < res.length; i++) {
        FPVD_subtree(res[i]);
    }
}

function FPVD_subtree(l) {
    if (l[0] != []) {
        let max_dist = 0;
        let best_point = null;
        let index = 0;
        for (let i = 0; i < l[0].length; i++) {
            let dist = dist_point_edge(l[0][i], l[1])
            if (dist > max_dist) {
                max_dist = dist;
                best_point = l[0][i];
                index = i;
            }
        }
        let tmp_point = new Point((l[1].p1.x + best_point.x) / 2, (l[1].p1.y + best_point.y) / 2);
        create_edge(l[1].p1, best_point, tmp_point);
        Intersect(edges[edges.length - 1], l[1]);
        let part = l[0].slice(0, index);
        FPVD_subtree([part, edges[edges.length - 1]]);
        tmp_point = new Point((l[1].p2.x + best_point.x) / 2, (l[1].p2.y + best_point.y) / 2);
        create_edge(best_point, l[1].p2, tmp_point);
        Intersect(edges[edges.length - 1], l[1]);
        part = l[0].slice(index + 1);
        FPVD_subtree([part, edges[edges.length - 1]]);
    }
}

function dist_point_edge(p, e) {
    return Math.abs(-e.a * p.x + p.y - e.b) / Math.sqrt(e.a ** 2 + 1);
}

function Intersect(e1, e2) {
    let x = (e1.b - e2.b) / (e2.a - e1.a);
    intersect = new Point(x, e1.a * x + e1.b);
    if (e1.x1 == null) {
        e1.setIntersect1(intersect.x, intersect.y);
    } else if (e1.x1 != intersect.x || e1.y1 != intersect.y) {
        e1.setIntersect2(intersect.x, intersect.y);
    }
    if (e2.x1 == null) {
        e2.setIntersect1(intersect.x, intersect.y);
    } else if (e2.x1 != intersect.x || e2.y1 != intersect.y) {
        e2.setIntersect2(intersect.x, intersect.y);
    }
}

function infinity_line() {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].x2 == null) {
            if ((edges[i].p1.x + edges[i].p2.x) / 2 > edges[i].x1) {
                edges[i].x2 = -9999;
                edges[i].y2 = edges[i].a * (-9999) + edges[i].b;
            } else if ((edges[i].p1.x + edges[i].p2.x) / 2 < edges[i].x1) {
                edges[i].x2 = 9999;
                edges[i].y2 = edges[i].a * 9999 + edges[i].b;
            } else if ((edges[i].p1.y + edges[i].p2.y) / 2 > edges[i].y1) {
                edges[i].y2 = -9999;
                edges[i].x2 = ((-9999) - edges[i].b) / edges[i].a;
            } else if ((edges[i].p1.y + edges[i].p2.y) / 2 < edges[i].y1) {
                edges[i].y2 = 9999;
                edges[i].x2 = (9999 - edges[i].b) / edges[i].a;
            } else {
                console.log("merde");
            }
        }
    }
}

windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
