var twoD = function (p5) {
    let bulb;
    let walls = [];

    p5.setup = function () {
        p5.createCanvas(400, 400);

        bulb = new Bulb();

        walls.push(new Wall(0, p5.height, p5.width, p5.height))
        walls.push(new Wall(0, 0, 0, p5.height))
        walls.push(new Wall(0, 0, p5.width, 0))
        walls.push(new Wall(p5.width, 0, p5.width, p5.height))

        for (let i = 0; i < 5; i++) {
            const x1 = p5.random(p5.width)
            const y1 = p5.random(p5.height)
            const x2 = p5.random(p5.width)
            const y2 = p5.random(p5.height)
            walls.push(new Wall(x1, y1, x2, y2))
        }
    }

    p5.draw = function () {
        p5.background(0);
        bulb.move(p5.mouseX, p5.mouseY)
        bulb.show()

        for (const w of walls) {
            w.show()
        }
        bulb.calculate(walls)
    }

    class Wall {
        constructor(x1, y1, x2, y2) {
            this.a = p5.createVector(x1, y1)
            this.b = p5.createVector(x2, y2)
        }

        show() {
            p5.stroke(255)
            p5.line(this.a.x, this.a.y, this.b.x, this.b.y)
        }
    }


    class Ray {
        constructor(pos, angle) {
            this.pos = pos
            this.dir = p5.constructor.Vector.fromAngle(angle)
        }

        show() {
            p5.push()
            p5.stroke(255)
            p5.line(this.pos.x, this.pos.y, this.dir.x * 10000, this.dir.y * 10000)
            p5.pop()
        }

        cast(wall) {
            const x3 = this.pos.x
            const x4 = this.pos.x + this.dir.x
            const y3 = this.pos.y
            const y4 = this.pos.y + this.dir.y

            const x1 = wall.a.x
            const x2 = wall.b.x
            const y1 = wall.a.y
            const y2 = wall.b.y

            const den1 = (x1 - x2) * (y3 - y4)
            const den2 = (y1 - y2) * (x3 - x4)
            const den = den1 - den2
            if (den === 0) return null;

            const t_num = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)
            const u_num = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)
            const t = t_num / den
            const u = u_num / den

            if (t > 0 && t < 1 && u > 0) {
                let pt = p5.createVector()
                pt.x = x1 + t * (x2 - x1)
                pt.y = y1 + t * (y2 - y1)
                return pt
            } else {
                return null;
            }
        }
    }

    class Bulb {
        constructor() {
            this.pos = p5.createVector(p5.width / 2, p5.height / 2)
            this.rays = []
            let rays = 150
            for (let i = 0; i < 359.9; i += 360 / rays) {
                let ray = new Ray(this.pos, p5.radians(i))
                this.rays.push(ray)
            }
        }

        move(x, y) {
            this.pos.set(x, y)
        }

        show() {
            p5.noStroke()
            p5.fill(255)
            p5.circle(this.pos.x, this.pos.y, 5)
        }

        calculate(walls) {
            for (const r of this.rays) {
                let closest = Infinity
                let record = null

                for (const w of walls) {
                    let pt = r.cast(w)
                    if (pt) {
                        const dis = Math.sqrt(p5.pow(pt.x - this.pos.x, 2) + p5.pow(pt.y - this.pos.y, 2))
                        if (dis < closest) {
                            closest = dis
                            record = pt
                        }
                    }
                }
                if (record) {
                    p5.stroke(255, 100)
                    p5.strokeWeight(4)
                    p5.line(this.pos.x, this.pos.y, record.x, record.y);
                }
            }
        }
    }
}

var myp2D = new p5(twoD, '2d')