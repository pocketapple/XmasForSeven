/* ----------------------------------------------------------------------------
 * image particles
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

class Particle {
  constructor (start, target, interval, duration, colour) {
    this.start = {x: start.x || 0, y: start.y || 0}
    this.position = {x: start.x || 0, y: start.y || 0}
    this.lastPos = {x: start.x || 0, y: start.y || 0}
    this.target = {x: target.x || 0, y: target.y || 0}
    this.interval = interval * 10 * Math.random()
    this.duration = duration
    this.colour = colour
    this.count = 0
    this.alpha = 1
  }
  draw (context) {
    let x = Math.round(this.position.x),
        y = Math.round(this.position.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5

    context.save()

    let gradient = context.createLinearGradient(x, y, x + xVel, y + yVel);    
    gradient.addColorStop(0, 'hsl(' + this.colour + ', 100%, 40%)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)')
    context.fillStyle = gradient
    context.globalAlpha = this.alpha
    
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + 2, y)
    context.lineTo(x + xVel, y + yVel)
    context.lineTo(x + xVel - 2, y + yVel)
    context.closePath()
    context.fill()

    context.restore()
  }
  update() {
    if (this.count < this.interval + this.duration) {
      if (this.count >= this.interval) {
        this.lastPos.x = this.position.x
        this.lastPos.y = this.position.y
        this.position.x = easeInOutQuad(this.count - this.interval, this.start.x, this.target.x - this.start.x, this.duration)
        this.position.y = easeInOutQuad(this.count - this.interval, this.start.y, this.target.y - this.start.y, this.duration)
      }
    } else {
      this.alpha -= 0.03 
    }
    this.count += Math.random() + 0.5
    return (this.alpha < 0.05)
  }
  static incise (source, width, height, colNum, rowNum, context) {
    context.drawImage(source, 0, 0)
    let raw = context.getImageData(0, 0, width, height).data
    context.clearRect(0, 0, width, height)

    let gridWidth = Math.round(width / colNum),
        gridHeight = Math.round(height / rowNum),
        pixels = []
    for (let i = 0; i < width; i += gridWidth) {
      for (let j = 0; j < height; j += gridHeight) {
        if (raw[(j * width + i) * 4]) {
          pixels.push({
            x: i + Math.random() * 10 - width / 2,
            y: j + Math.random() * 10 - height / 2
          })
        }
      }
    }
    return pixels
  }
}
