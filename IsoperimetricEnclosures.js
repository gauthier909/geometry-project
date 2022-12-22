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
var drawCircle = false;
var fpvd_vertices = [];
var enclosure_order = [];
var enclosure_radius = 0;
var DrawEnclosure = false;

function setup() {
    createCanvas(windowWidth, 700);

    input = createInput();
    //input.position(30, 200);
    button = createButton('Add random point');

    button.mousePressed(randomPoint);

    button2 = createButton('Draw');

    button2.mousePressed(drawSetup);

    button3 = createButton('Clear');
    button3.mousePressed(reset);
    //button.position(input.x + input.width, 200);
    //button2.position(button.x + button.width, 200);
    //button3.position(button2.x + button2.width, 200);

}

function Construct_FPVD() {
    if (fpvd == false) {
        fpvd = true;
    } else {
        fpvd = false;
    }
}

function reset() {
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
    drawCircle = false;
    fpvd_vertices = [];
    enclosure_order = [];
    enclosure_radius = 0;
    DrawEnclosure = false;
}

function draw() {
    // Put drawings here
    background(200);
    fill(255, 0, 0, 127);
    for (i in points) {
        ellipse(points[i].x, points[i].y, 4, 4);
    }

    for (i in lines) {
        line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
    if (drawCircle) {
        circle(circles[0].x, circles[0].y, circles[0].r);
        /*
        for (i in circles) {
            circle(circles[i].x, circles[i].y, circles[i].r);
            fill(255, 0, 0, 127);
        }
        */
    }
    /*
    if (showCenter) {
        ellipse(circles[0].x, circles[0].y, 10, 10)
    }
    */
    if (fpvd && showCenter) {
        if (fpvd_2 == true) {
            FPVD();
        }
        for (let i = 0; i < edges.length; i++) {
            line(edges[i].x1, edges[i].y1, edges[i].x2, edges[i].y2);
        }
        fpvd_2 = false;
    }

    if (DrawEnclosure == true) {
        draw_enclosure(enclosure_radius);
    }

}

/*Add random point in the canva*/
function randomPoint() {
    let width = Math.floor(Math.random() * 300) + 400;
    let height = Math.floor(Math.random() * 300) + 200;
    let p = new Point(width, height);
    points.push(p);
}



function drawSetup() {
    /*compute the convex hull*/
    lines = [];
    convexHull = [];
    DrawEnclosure = false;
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
    /*compute the smallest circle*/
    smallestCircle();
    var userP = input.value();
    var circleP = calculateCircleP(circles[0].r);
    if (circleP > userP) {
        drawCircle = false;
        let tmp_p = 0;
        for (let i = 0; i < lines.length; i++) {
            let p1 = new Point(lines[i].x1, lines[i].y1);
            let p2 = new Point(lines[i].x2, lines[i].y2);
            tmp_p += findDist(p1, p2);
        }
        console.log("tmp perimeter : ");
        console.log(tmp_p);
        if (userP > tmp_p) {
            /*compute the FPVD*/
            FPVD();
            /*sort the vertices by p*/
            fpvd_vertices.sort(function(a, b){return a[1] - b[1]});
            /*Binary search*/
            console.log("coucou1");
            let r = Binary_search(userP);
            console.log("coucou2");
            console.log(r);
            if (r[0] != r[1]) {
                r = approx_r(r, userP);
                enclosure_radius = r;
            } else {
                //draw_enclosure(r[0]);
                enclosure_radius = r[0];
            }
            DrawEnclosure = true;
        }
    } else {
        /*draw the smallest circle*/
        newDiametre = userP / (Math.PI);
        circles[0].r = newDiametre;
        drawCircle = true;
    }
}

function calculateCircleP(r) {
    return Math.PI * r;
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
    console.log(convexHull);
    const result = (welzl(convexHull, convexHull.length, [], 0));
    let smallestCircle = new Circle(result.x, result.y, result.r * 2);
    while (circles.length > 0) {
        circles.pop();
    }
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
    return ((c.x - p.x) * (c.x - p.x) + (c.y - p.y) * (c.y - p.y) <= c.r * c.r + 0.1)
}

function FPVD() {
    edges = [];
    if (CH_is_sorted == false) {
        classifyClockWise();
    }
    let boundary_points = boundary(sorted);
    //let infinity_0 = true;
    let circle_flag = false;
    if (boundary_points.length > 2) {
        circle_flag = true;
        infinity_0 = false
    }
    FPVD_tree(boundary_points, sorted, circle_flag);
    //infinity_line(infinity_0);
}

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

function createEdge(p1, p2, c) {
    let a = p2.y - p1.y;
    let b = p1.x - p2.x;
    a = a*(-1)/b;
    a = (-1)*(a**(-1));
    b = c.y - a*c.x;
    let edge = new Edge(a, b, p1, p2);
    edges.push(edge);
}

function FPVD_tree(p_list, ch, c) {
    let flag = true;
    let res = [];
    let part = [];
    let index = 0;
    let swap_edge_points = false;

    create_vertex(circles[0]);

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

function Intersect(e1, e2, index) {
    let x = (e1.b - e2.b)/(e2.a - e1.a);
    intersect = new Point(x, e1.a*x + e1.b);
    if (e1.x1 == null) {
        e1.setIntersect1(intersect.x, intersect.y);
        create_vertex(intersect);
    } else if (!(e1.x1 < intersect.x + 0.1 && e1.x1 > intersect.x -0.1 
        && e1.y1 < intersect.y + 0.1 && e1.y1 > intersect.y -0.1)) {
        e1.setIntersect2(intersect.x, intersect.y);
        create_vertex(intersect);
    }
    if (e2.x1 == null) {
        e2.setIntersect1(intersect.x, intersect.y);
        create_vertex(intersect);
        edges[index] = e2;
    } else if (!(e2.x1 < intersect.x + 0.1 && e2.x1 > intersect.x -0.1 
        && e2.y1 < intersect.y + 0.1 && e2.y1 > intersect.y -0.1)) {
        e2.setIntersect2(intersect.x, intersect.y);
        create_vertex(intersect);
        edges[index] = e2;
    }
}

function create_vertex(vertex) {
    let already_registered = false;
    for (let i = 0; i < fpvd_vertices.length; i++) {
        if (fpvd_vertices[i][0].x == vertex.x && fpvd_vertices[i][0].y == vertex.y) {
            already_registered = true;
            break;
        }
    }
    if (already_registered == false) {
        let p = compute_p_vertex(vertex);
        fpvd_vertices.push([vertex, p[0], "", p[1]]);
    }
}

function compute_p_vertex(vertex) {
    let best_p = 0;
    let index = [-1, -1];
    let dist;
    for (let i = 0; i < sorted.length; i++) {
        dist = Math.sqrt((sorted[i].y - vertex.y)**2 + (sorted[i].x - vertex.x)**2);
        if (dist > best_p - 0.1 && dist < best_p + 0.1) {
            index[1] = i;
        } else if (dist > best_p) {
            best_p = dist;
            index[0] = i;
            index[1] = -1;
        }
    }
    return [best_p, index]
}

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

function Binary_search(P) {
    let res = [];
    let index = Math.round(fpvd_vertices.length/2);
    console.log(index);
    console.log(fpvd_vertices);
    /*
    while (((fpvd_vertices.length != index && (fpvd_vertices[index-1][2] != "plus" || 
    fpvd_vertices[index][2] != "minus")) && (index != 1 && (fpvd_vertices[index-1][2] != "minus" &&
     fpvd_vertices[index-2][2] != "plus")) && fpvd_vertices[index-1][2] != "equal")) {
    */
    while (index != 0 && index <= fpvd_vertices.length && fpvd_vertices[index-1][2] == "") {
        perimeter = P_from_enclosure(fpvd_vertices[index-1]);
        console.log(perimeter);
        console.log(index);
        console.log(fpvd_vertices);
        if (perimeter > P) {
            fpvd_vertices[index-1][2] = "plus";
            index = index + Math.round(index/2);
        } else if (perimeter < P) {
            fpvd_vertices[index-1][2] = "minus";
            index = index - Math.round(index/2);
        } else {
            fpvd_vertices[index-1][2] = "equal";
        }
    }
    if ((fpvd_vertices.length == 1 && index != 1) || index == 0) {
        index = 1;
    }
    if (fpvd_vertices[index-1][2] == "minus") {
        if (index != 1) {
            res = [fpvd_vertices[index-2][1], fpvd_vertices[index-1][1]];
        } else {
            res = [10, fpvd_vertices[index-1][1]];
        }
    } else if (fpvd_vertices[index-1][2] == "plus") {
        if (index != fpvd_vertices.length) {
            res = [fpvd_vertices[index-1][1], fpvd_vertices[index][1]];
        } else {
            res = [fpvd_vertices[index-1][1], fpvd_vertices[index-1][1]*2];
        }
    } else {
        res = [fpvd_vertices[index-1][1], fpvd_vertices[index-1][1]];
    } 
    return res;
}

function P_from_enclosure(p) {
    enclosure_order = [[sorted[p[3][0]], sorted[p[3][1]]]];
    console.log(p[3][0]);
    console.log(p[3][1]);
    let angle = AngleBetweenPoints(sorted[p[3][0]], sorted[p[3][1]], p[0]);
    let perimeter = Math.abs(angle)*p[1];
    console.log(p[1]);
    console.log(p[0]);
    console.log(sorted[p[3][0]]);
    console.log(sorted[p[3][1]]);
    console.log(angle);
    let cpy_sorted = sorted.slice();
    let shift_at_the_end = cpy_sorted.slice(0, p[3][0]+1);
    for (let i = 0; i < p[3][1]; i++) {
        cpy_sorted.shift();
    }
    cpy_sorted = cpy_sorted.concat(shift_at_the_end);
    console.log(cpy_sorted);
    console.log(cpy_sorted.length);
    while (cpy_sorted.length > 0) {
        for (let i = 1; i < cpy_sorted.length; i++) {
            let flag = false;
            //console.log("khebab1");
            let center = findCenter(cpy_sorted[0], cpy_sorted[i], p[1]);
            //console.log("khebab2");
            //console.log(center);
            //console.log("khebab1");
            for (let j = 0; j < sorted.length; j++) {
                //console.log(sorted[j]);
                if (!inCircle(sorted[j], center)) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                console.log("bonjour");
                console.log(i);
                enclosure_order.push([cpy_sorted[0], cpy_sorted[i]]);
                angle = AngleBetweenPoints(cpy_sorted[0], cpy_sorted[i], center);
                perimeter += Math.abs(angle)*p[1];
                for (let j = 0; j < i; j++) {
                    cpy_sorted.shift();
                }
                if (cpy_sorted.length == 1) {
                    cpy_sorted.shift();
                }
                break;
            }
        }
    }
    console.log("fini");
    return perimeter;
}

function approx_r(p, P) {
    let r = (p[0] + p[1])/2;
    let perimeter = 0;
    let center;
    let angle;
    console.log(enclosure_order);
    while ((perimeter < (P - 0.1)) || (perimeter > (P + 0.1))) {
        perimeter = 0;
        if (p[0] != 10 && (p[1] > p[0]*2 + 0.1 || p[1] < p[0]*2 - 0.1)) {
            for (let i = 0; i < enclosure_order.length; i++) {
                center = findCenter(enclosure_order[i][0], enclosure_order[i][1], r);
                angle = AngleBetweenPoints(enclosure_order[i][0], enclosure_order[i][1], center);
                perimeter += Math.abs(angle)*r;
            }
        } else {
            console.log("else");
            let cpy_sorted = sorted.slice();
            cpy_sorted.push(sorted[0]);
            enclosure_order = [];
            while (cpy_sorted.length > 0) {
                Loop1 :
                for (let i = 1; i < cpy_sorted.length; i++) {
                    let flag = false;
                    let center = findCenter(cpy_sorted[0], cpy_sorted[i], r);
                    Loop2 :
                    for (let j = 0; j < sorted.length; j++) {
                        if (!inCircle(sorted[j], center)) {
                            flag = true;
                            break Loop2;
                        }
                    }
                    if (flag == false) {
                        enclosure_order.push([cpy_sorted[0], cpy_sorted[i]]);
                        angle = AngleBetweenPoints(cpy_sorted[0], cpy_sorted[i], center);
                        perimeter += Math.abs(angle)*r;
                        for (let j = 0; j < i; j++) {
                            cpy_sorted.shift();
                        }
                        if (cpy_sorted.length == 1) {
                            cpy_sorted.shift();
                        }
                        break Loop1;
                    }
                }
            }
        }
        if (!(perimeter > (P - 0.1) && perimeter < (P + 0.1))) {
            if (perimeter < P) {
                r -= (r - p[0])/2;
            } else {
                r += (p[1] - r)/2;
            }
        }
    }
    console.log("approx fini");
    console.log(r);
    console.log(P);
    console.log(perimeter);
    if (!((perimeter < (P - 0.1)) || (perimeter > (P + 0.1)))) {
        console.log("success");
    }
    return r;
}

function findCenter(p1, p2, radius) {
    let q = findDist(p1, p2);
    let x = (p1.x + p2.x)/2;
    let y = (p1.y + p2.y)/2;
    let x_F = x + Math.sqrt(radius**2-(q/2)**2)*(p1.y-p2.y)/q;
    let y_F = y + Math.sqrt(radius**2-(q/2)**2)*(p2.x-p1.x)/q;
    let c = new Circle(x_F, y_F, radius);

    for (let i = 0; i < sorted.length; i++) {
        if (!inCircle(sorted[i], c)) {
            x_F = x - Math.sqrt(radius**2-(q/2)**2)*(p1.y-p2.y)/q;
            y_F = y - Math.sqrt(radius**2-(q/2)**2)*(p2.x-p1.x)/q;
            break;
        }
    }

    let center = new Circle(x_F, y_F, radius);
    return center;
}

function draw_enclosure(r) {
    let center;
    let angle1;
    let angle2;
    for (let i = 0; i < enclosure_order.length; i++) {
        center = findCenter(enclosure_order[i][0], enclosure_order[i][1], r);
        angle1 = findAngle(center, enclosure_order[i][0], r);
        angle2 = findAngle(center, enclosure_order[i][1], r);
        drawArc(center, angle1, angle2, enclosure_order[i][0], enclosure_order[i][1], r);
    }
}

//Cosine rule
function findAngle(center, p1, radius) {
    let dist_p1_center = findDist(p1, center);
    let p2 = new Point(center.x + radius, center.y);
    let dist_p1_p2 = findDist(p1, p2);
    let angle = Math.acos((2*dist_p1_center**2 - dist_p1_p2**2)/(2*dist_p1_center**2));
    return angle;
}

function findDist(p1, p2) {
    let dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
    return dist;
}

//Cosine rule
function AngleBetweenPoints(p1, p2, center) {
    let dist_p1_center = findDist(p1, center);
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

windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}


