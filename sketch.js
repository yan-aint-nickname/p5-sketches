let bulb;
let walls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  bulb = new Bulb();
  
  walls.push(new Wall(0, height, width, height))
  walls.push(new Wall(0, 0, 0, height))
  walls.push(new Wall(0, 0, width, 0))
  walls.push(new Wall(width, 0, width, height))
  
  for (let i=0; i<5; i++) {
    x1 = random(width)
    y1 = random(height)
    x2 = random(width)
    y2 = random(height)
    walls.push(new Wall(x1, y1, x2, y2))
  }
}

function draw() {
  background(0);
  bulb.move(mouseX, mouseY)
  bulb.show()
  
  for (const w of walls) {
    w.show()
  }
  bulb.calculate(walls)
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
  }
  
  show() {
    stroke(255)
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}


class Ray {
  constructor(pos, angle) {
    this.pos = pos
    this.dir = p5.Vector.fromAngle(angle)
  }
  
  show() {
    push()
    stroke(255)
    line(this.pos.x, this.pos.y, this.dir.x*10000, this.dir.y*10000)
    pop()
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
    
    const den1 = (x1 - x2)*(y3 - y4)
    const den2 = (y1 - y2)*(x3 - x4)
    const den = den1 - den2
    if (den === 0) return null;
    
    const t_num = (x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)
    const u_num = (x1-x3)*(y1-y2) - (y1-y3)*(x1-x2)
    const t = t_num/den
    const u = u_num/den
    
    if (t > 0 && t < 1 && u > 0) {
      let pt = createVector()
      pt.x = x1 + t*(x2-x1)
      pt.y = y1 + t*(y2-y1)
      return pt
    } else {
      return null;
    }
  }
}

class Bulb {
  constructor () {
    this.pos = createVector(width/2, height/2)
    this.rays = []
    let rays = 150
    for (let i=0;i<359.9; i+=360/rays) {
      let ray = new Ray(this.pos, radians(i))
      this.rays.push(ray)
    }
  }
  
  move(x, y) {
    this.pos.set(x, y)
  }
  
  show() {
    noStroke()
    fill(255)
    circle(this.pos.x, this.pos.y, 5)
  }
  
  calculate(walls) {
    for (const r of this.rays) {
      let closest = Infinity
      let record = null
      
      for (const w of walls) {
        let pt = r.cast(w)
        if (pt) {
          const dis = Math.sqrt(pow(pt.x-this.pos.x, 2)+pow(pt.y-this.pos.y, 2))
          if (dis < closest) {
            closest = dis
            record = pt
          }
        }
      }
      if (record) {
        stroke(255, 100)
        strokeWeight(4)
        line(this.pos.x, this.pos.y, record.x, record.y);
      }
    }
  }
}
