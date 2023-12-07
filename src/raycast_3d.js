var threeD = function (p5) {
    let lamp;
    let walls = [];

    let sceneH = 400;
    let sceneW = 400;

    p5.setup = function () {

        p5.createCanvas(800, 400);

        lamp = new Lamp(400, 400);

        walls.push(new Wall(0, sceneH, sceneW, sceneH))
        walls.push(new Wall(0, 0, 0, sceneH))
        walls.push(new Wall(0, 0, sceneW, 0))
        walls.push(new Wall(sceneW, 0, sceneW, sceneH))


        walls.push(new Wall(100, 300, 300, 300))
        walls.push(new Wall(100, 300, 100, 200))
        walls.push(new Wall(300, 100, 300, 250))
        walls.push(new Wall(100, 100, 200, 100))
        walls.push(new Wall(100, 100, 100, 150))
    }

    p5.draw = function () {
        p5.background(0);
        lamp.rotate_(p5.mouseX, p5.mouseY)
        lamp.show()

        for (const w of walls) {
            w.show()
        }
        let scene = lamp.calculate(walls)
        let segment = sceneW / scene.length

        for (let i = 0; i < scene.length; i++) {
            closest = scene[i]
            p5.stroke(p5.color(p5.sin(p5.radians(closest)) * 255))
            p5.line(410 + i * segment, 0 + closest / 2, 410 + i * segment, sceneH - closest / 2)
        }
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
            this.angle = angle
            this.dir = p5.constructor.Vector.fromAngle(angle)
        }

        show() {
            p5.push()
            p5.stroke(255)
            p5.line(this.pos.x, this.pos.y, this.dir.x * 1000, this.dir.y * 1000)
            p5.pop()
        }

        rotate_(angle) {

            let ang = angle + this.angle

            let dir = p5.constructor.Vector.fromAngle(ang)
            const x = dir.x * 1000
            const y = dir.y * 1000
            this.dir.set(x, y)
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

    class Lamp {
        constructor(x, y) {
            this.pos = p5.createVector(x / 2, y / 2)
            this.dir = p5.constructor.Vector.fromAngle(0)
            this.rays = []
            let rays = 50
            let angle = 45;
            for (let i = -angle; i <= angle; i += angle / rays) {
                let ray = new Ray(this.pos, p5.radians(i))
                this.rays.push(ray)
            }
        }

        rotate_(x, y) {
            let targetAngle = p5.atan2(y - this.pos.y, x - this.pos.x);
            for (const r of this.rays) {
                r.rotate_(targetAngle)
            }
        }

        show() {
            p5.noStroke()
            p5.fill(255)
            p5.circle(this.pos.x, this.pos.y, 5)
        }

        calculate(walls) {
            let scene = []
            for (let i = 0; i < this.rays.length; i++) {
                let closest = Infinity
                let record = null

                for (const w of walls) {
                    let pt = this.rays[i].cast(w)
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
                scene[i] = closest
            }
            return scene
        }
    }
}
var myp3D = new p5(threeD, '3d')