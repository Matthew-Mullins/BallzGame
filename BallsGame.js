var balls = [];
var cells = [];

var startLocation;

var betweenRounds = true;

var roundNum = 0;

function setup() {
  createCanvas(480, 640);
  startLocation = createVector(240, 640);
  balls.push(new Ball(240, 640));
  nextRound();
}

function draw() {
  background(0);
  for(var i = balls.length - 1; i >= 0; i--){
    balls[i].update();
  }
  for(var i = cells.length - 1; i >= 0; i--){
    if(cells[i].value <= 0 && !cells[i].isPowerUp){
      cells.splice(i, 1);
    } else {
      cells[i].update();
    }
  }
  if(mouseIsPressed && mouseX <= width && mouseX >= 0 && mouseY >=0 && mouseY <= height){
    for(var i = 0; i < balls.length; i++){
      balls[i].shoot();
    }
  }
}

function nextRound(){
  roundNum++;
  for(var i = 0; i < cells.length; i++){
    cells[i].pos.y += 60;
  }
  var cellIndexArray = new Array(0, 1, 2, 3, 4, 5, 6, 7);
  var extraBall = random(cellIndexArray);
  cells.push(new PowerUp(extraBall));
  cellIndexArray.splice(cellIndexArray.indexOf(extraBall), 1); 
  var r = random(1, 7);
  for(var i = 0; i < r; i++){
    var blockLoc = random(cellIndexArray);
    cells.push(new Block(blockLoc, roundNum));
    cellIndexArray.splice(cellIndexArray.indexOf(blockLoc), 1);
  }
}

function Ball(x_, y_){
  this.r = 10;
  this.pos = createVector(x_, y_ - this.r);
  this.vel;
  this.speed = 15;
  this.stopped = true;
  
  this.shoot = function(){
    if(this.stopped){
      this.stopped = false;
      this.vel = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
      this.vel.normalize();
    }
  }
  
  this.collision = function(){
    for(var i = cells.length - 1; i >= 0 ; i--){
      if(cells[i].isPowerUp){
        if(abs(this.pos.dist(cells[i].pos)) <= cells[i].r + this.r){
          console.log(abs(cells[i].pos.dist(this.pos)));
          cells.splice(i, 1);
        }
      } else if(!cells[i].isPowerUp){
        var cellTop = cells[i].pos.y + cells[i].offset;
        var cellBottom = cells[i].pos.y + cells[i].w + cells[i].offset;
        var cellLeft = cells[i].pos.x + cells[i].offset;
        var cellRight = cells[i].pos.x + cells[i].w + cells[i].offset;
        var ballTop = this.pos.y - this.r;
        var ballBottom = this.pos.y + this.r;
        var ballLeft = this.pos.x - this.r;
        var ballRight = this.pos.x + this.r;
        
        if((ballTop <= cellBottom) && (ballTop >= cellTop) && (((ballLeft >= cellLeft) && (ballLeft <= cellRight)) || ((ballRight >= cellLeft) && (ballRight <= cellRight)))){
          if(!cells[i].isHit){
            this.vel.y *= -1;
            cells[i].value--;
          }
          cells[i].isHit = true;
        }
        if((ballBottom >= cellTop) && (ballBottom <= cellBottom) && (((ballLeft >= cellLeft) && (ballLeft <= cellRight)) || ((ballRight >= cellLeft) && (ballRight <= cellRight)))){
          if(!cells[i].isHit){
            this.vel.y *= -1;
            cells[i].value--;
          }
          cells[i].isHit = true;
        }
        if((ballLeft >= cellLeft) && (ballLeft <= cellRight) && (((ballTop >= cellTop) && (ballTop <= cellBottom)) || ((ballBottom >= cellTop) && (ballBottom <= cellBottom)))){
          if(!cells[i].isHit){
            this.vel.x *= -1;
            cells[i].value--;
          }
          cells[i].isHit = true;
        }
        if((ballRight >= cellLeft) && (ballRight <= cellRight) && (((ballTop >= cellTop) && (ballTop <= cellBottom)) || ((ballBottom >= cellTop) && (ballBottom <= cellBottom)))){
          if(!cells[i].isHit){
            this.vel.x *= -1;
            cells[i].value--;
          }
          cells[i].isHit = true;
        }
        cells[i].isHit = false;
      }
    }
  }
  
  this.move = function(){
    
    this.pos.x += this.vel.x * this.speed;
    this.pos.y += this.vel.y * this.speed;
    this.collision();
    if(this.pos.x - this.r <= 0 || this.pos.x + this.r >= width)
      this.vel.x *= -1;
    if(this.pos.y - this.r <= 0)
      this.vel.y *= -1;
    if(this.pos.y + this.r >= height){
      this.stopped = true;
      nextRound();
    }
  }
  
  this.update = function(){
    if(!this.stopped)
      this.move();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function Block(index, value_){
  this.offset = 5;
  this.pos = createVector(index * 60, 0);
  this.w = 50;
  this.value = value_;
  this.isPowerUp = false;
  this.isHit = false;
  
  this.update = function(){
    fill(100);
    noStroke();
    rect(this.pos.x + this.offset, this.pos.y + this.offset, this.w, this.w);
    fill(255);
    textSize(24);
    text(this.value + " ", this.pos.x + this.offset, this.pos.y + 12 + this.w/2); 
  }
}

function PowerUp(index){
  this.offset = 30;
  this.pos = createVector(index * 60 + this.offset, 0 + this.offset);
  this.r = 15;
  this.isPowerUp = true;
  
  this.update = function(){
    fill(200);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2); 
  }
}