//Create variables here
var database;
var dog,happydog,food,foodStock,foodImage,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;
var namebox;
var value;
var milkImg,milkbottle;

function preload()
{
  dogImg=loadImage("images/Dog.png");
  happydogImg=loadImage("images/happydog.png");
  milkImg=loadImage("images/Milk.png");
}

function setup() {

  database=firebase.database();
  createCanvas(600,500);
  foodObj=new Food();
  
  dog=createSprite(400,300);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed = createButton("Feed your dog");
  feed.position(600,200);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(720,200);
  addFood.mousePressed(addFoods);
  
  namebox = createInput('').attribute('placeholder','Your pet name');
  namebox.position(400,200)

  milkbottle = createSprite(370,320)
  milkbottle.addImage(milkImg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1
  
}


function draw() { 
  background(46,139,87); 

  value = namebox.value();

  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 300,30);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",300,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 300,30);
   }
   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)

  drawSprites();
  

}

function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(dogimage);
  }
  else{
    dog.addImage(dogImg);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(happydogImg);
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}

function readStock(data){
  foodStock=data.val();
}





