class Game {
  constructor() {
    this.resettitle=createElement("h2") 
    this.resetbutton=createButton("")

    this.leaderBoardTitle=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")

    this.fuel=185
  }

  getState() {
    var gameStateref=database.ref("gameState")
    gameStateref.on("value",function(data){
      gameState=data.val()
    })
  }
  start() {
    form = new Form();
    form.display();

    player = new Player();
    playerCount=player.getCount()

    car1=createSprite(width/2-50,height-100)
    car1.addImage("car1",car1Img)  
    car1.scale=0.07
    car2=createSprite(width/2+100,height-100)
    car2.addImage("car2",car2Img)  
    car2.scale=0.07
    cars=[car1,car2]

    fuels=new Group();
    coins=new Group();
    obstacles=new Group();
    this.addSprites(fuels,4,fuelI,0.02)
    this.addSprites(coins,18,coinI,0.09)

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1},
      { x: width / 2 - 180, y: height - 2300, image: obstacle2 },
      { x: width / 2, y: height - 2800, image: obstacle2 },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1 },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2 },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2 },
      { x: width / 2, y: height - 5300, image: obstacle1 },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2 }
    ];
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1,0.04,obstaclesPositions)
  }


  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]) {
  for(var i =0;i<numberOfSprites;i++) {
    var x,y;
    if(positions.length>0) {
      x=positions[i].x
      y=positions[i].y
      spriteImage=positions[i].image
    } else {
    x=random(width/2+150,width/2-150);
    y=random(-height*4.5,height-400);
    }
    var sprite=createSprite(x,y)
    sprite.addImage("sprite",spriteImage);
    sprite.scale=scale
    spriteGroup.add(sprite)
  }
  }

  update(state) {
database.ref("/").update({
  gameState:state
})
  }

  handleElements() {
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resettitle.html("Reset Game")
    this.resettitle.class("resettext")
    this.resettitle.position(width/2+200,40)
    this.resetbutton.class("resetbutton")
    this.resetbutton.position(width/2+230,100)

    this.leaderBoardTitle.html("Leader Board")
    this.leaderBoardTitle.class("resettext")
    this.leaderBoardTitle.position(width/3-60,40)

    this.leader1.class("leaderstext")
    this.leader1.position(width/3-50,80)

    this.leader2.class("leaderstext")
    this.leader2.position(width/3-50,130)
  }
  handleFuel(index) {
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel=185
      collected.remove()
    }) 
  }
  handleCoin(index) {
    cars[index-1].overlap(coins,function(collector,collected){
      player.score+=10
      player.update()
      collected.remove()
    }) 
  }
   
  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully", 
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png", 
      imageSize: "100x100", 
      confirmButtonText: "Ok"
    })
  }
  
  
  play() {
    this.handleElements();
    this.handlePlayerControls() ;
    this.handleResetButton();
    Player.getplayerinfo()
    player.getCarsAtEnd()
    
    const finishLine=height*6-100
    if(player.positionY>finishLine) {
      gameState=2
      player.rank+=1
      Player.updateCarssAtEnd(player.rank)
      player.update()
      this.showRank()
    }
    if(allplayers!==undefined)
{
  image(track,0,-height*5,width,height*6)
  this.showLeaderBoard()
  var index=0
  for(var plr in allplayers)
  {
    console.log(allplayers)
    index=index+1
    var x=allplayers[plr].positionX
    var y=height-allplayers[plr].positionY
    cars [index-1].position.x=x
    cars [index-1].position.y=y
    if(index===player.index) {
      stroke(10)
      fill("red")
      ellipse(x,y,60,60)
      this.handleFuel(index)
      this.handleCoin(index)
      camera.position.y=cars[index-1].position.y
    }
  }
  

 

  
  drawSprites();
} 
  

  }

  showLeaderBoard() {
    var leader1,leader2
    var players=Object.values(allplayers)
    if((players[0].rank===0 && players[1].rank===0)|| players[0].rank===1) {
      leader1=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader2=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score

    }
    if(players[1].rank===1) {
      leader1=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
      leader2=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score

    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  handleResetButton() {
   this.resetbutton.mousePressed(()=>{
     database.ref("/").set({
       playerCount:0,
       gameState:0,
       players:{}
     })
  window.location.reload()
   })
  }

  handlePlayerControls() {
    if(keyIsDown(UP_ARROW)){
   player.positionY+=10
   player.update()
    }

    if(keyIsDown(LEFT_ARROW)&& player.positionX>width/3-50){
      player.positionX-=5
      player.update()
       }

       if(keyIsDown(RIGHT_ARROW)&& player.positionX<width/2+300){
        player.positionX+=5
        player.update()
         }
  }
}

