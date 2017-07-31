var balls = [];
var cells = [];

var betweenRounds = true;

var roundNum = 0;

function setup() {
  createCanvas(480, 640);
  balls.push(new Ball(240, 640 - 10));
  nextRound();
}

function draw() {
  background(0);
  for(var i = 0; i < balls.length; i++){
    balls[i].update();
  }
  for(var i = 0; i < cells.length; i++){
    cells[i].update();
  }
  if(mouseIsPressed){
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
  
  this.move = function(){
    this.pos.x += this.vel.x * this.speed;
    this.pos.y += this.vel.y * this.speed;
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
  this.pos = createVector(index * 60, 0);
  this.r = 20;
  
  this.update = function(){
    fill(200);
    noStroke();
    ellipse(this.pos.x + this.offset, this.pos.y + this.offset, this.r, this.r); 
  }
}