var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage,backgroundObject, backgroundImage;

var coinGroup, coinImage,tree1Image,tree2Image,tree3Image;
var obstaclesGroup, obstacle2, obstacle1,obstacle3,tree1,tree2,tree3;
var scoreSound;
var score=0;
var marioLife;


var gameOver, restart;



function preload(){
  mario_running = loadImage("rab.png");
  mario_collided = loadImage("ra.png");
  groundImage = loadImage("backg.jpg");
  backgroungImage=loadImage("backg.jpg")
  coinImage = loadImage("carrot.png");
  obstacle2 = loadImage("hunter.png");
  obstacle1 = loadImage("hunter.png");
  obstacle3 = loadImage("hunter.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  scoreSound=loadSound("coin.wav");
  tree1Image=loadImage=("tree");
   tree2Image=loadImage=("tre");
   tree3Image=loadImage=("tr");
}

function setup() {
  createCanvas(600, 200);
  mario = createSprite(70,0,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.08;
  
  
  
  ground = createSprite(0,190,1200,10);
  ground.shapeColor=("green");
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,90);
  restart.addImage(restartImg);
  
  
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  marioLife=3;
}

function draw() {
  background("lightblue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  text("Mario Life: "+ marioLife, 50,40);
//text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
   //score = score + Math.round(getFrameRate()/60);
    mario.scale=0.08;
    
    if (marioLife===0){
        marioLife=3;
        }   
    if(mario.isTouching(coinGroup)){
       score=score+1;
      scoreSound.play();
      coinGroup.destroyEach();
       }
      if(mario.isTouching(obstaclesGroup)){
       marioLife=marioLife-1;
      coinGroup.destroyEach();
       }
      
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 90) {
      mario.velocityY = -15;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    } 
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(+100000);
    coinGroup.setVelocityXEach(+100000);
    
    //change the trex animation
    mario.y=140;
    mario.x=300;
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.08;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
      mario.x=50;
      mario.y=80;
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
    var coin = createSprite(400,200,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(500,150,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
      
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}