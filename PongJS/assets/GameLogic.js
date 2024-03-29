
var DIFFICULTY = 2;			//how fast the game gets mor difficult
var ROCK_TIME = 110;		//aprox tick count untill a new asteroid gets introduced
var SUB_ROCK_COUNT = 4;		//how many small rocks to make on rock death
var BULLET_TIME = 5;		//ticks between bullets
var BULLET_ENTROPY = 100;	//how much energy a bullet has before it runs out.

var TURN_FACTOR = 7;		//how far the ship turns per frame
var BULLET_SPEED = 17;		//how fast the bullets move

var KEYCODE_ENTER = 13;		//usefull keycode
var KEYCODE_SPACE = 32;		//usefull keycode
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_DOWN = 40;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_W = 87;			//usefull keycode
var KEYCODE_A = 65;			//usefull keycode
var KEYCODE_D = 68;			//usefull keycode
var KEYCODE_S = 83;			//usefull keycode

var shootHeld;			//is the user holding a shoot command
var lfHeld;				//is the user holding a turn left command
var rtHeld;				//is the user holding a turn right command
var fwdHeld;			//is the user holding a forward command
var backHeld;			//is the user holding a forward command


var timeToRock;			//difficulty adjusted version of ROCK_TIME
var nextRock;			//ticks left untill a new space rock arrives
var nextBullet;			//ticks left untill the next shot is fired

var rockBelt;			//space rock array
var bulletStream;		//bullet array

var canvas;			//Main canvas
var stage;			//Main display stage

var ship;			//the actual ship
var alive;			//wheter the player is alive

var barElement;
var barElement2;
var cube;

var messageField;		//Message display field
var scoreField;			//score Field

var loadingInterval = 0;

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var preload;

function init() {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }

    canvas = document.getElementById("gameCanvas");
    stage = new Stage(canvas);
    messageField = new Text("Loading", "bold 24px Arial", "#FFFFFF");
    messageField.maxWidth = 1000;
    messageField.textAlign = "center";
    messageField.x = canvas.width / 2;
    messageField.y = canvas.height / 2;
    stage.addChild(messageField);
    stage.update(); 	//update the stage to show text
    doneLoading();
    
}

function doneLoading() {

    
    scoreField = new Text("0", "bold 12px Arial", "#FFFFFF");
    scoreField.textAlign = "right";
    scoreField.x = canvas.width - 10;
    scoreField.y = 22;
    scoreField.maxWidth = 1000;

    messageField.text = "Welcome:  Click to play";

    watchRestart();
}

function watchRestart() {
    //watch for clicks
    
    stage.addChild(messageField);
    stage.update(); 	//update the stage to show text
    canvas.onclick = handleClick;
}

function handleClick() {
    //prevent extra clicks and hide text
    canvas.onclick = null;
    stage.removeChild(messageField);

    // indicate the player is now on screen
    //SoundJS.play("begin");

    restart();
}

//reset all game logic
function restart() {
    //hide anything on stage and show the score
    stage.removeAllChildren();
    scoreField.text = (0).toString();
    stage.addChild(scoreField);

    //new arrays to dump old data
    rockBelt = new Array();
    bulletStream = new Array();

    //create the player
    alive = true;
    ship = new Ship();
    ship.x = (canvas.width / 2) +30;
    ship.y = (canvas.height / 2) +30;
    

    barElement = new BarElement();
    barElement.x = (10 ) ;
    barElement.y = (canvas.height / 2);
    
    barElement2 = new BarElement();
    barElement2.x = (canvas.width  - 10) ;
    barElement2.y = (canvas.height / 2);
    
    cube = new Cube();
    cube.x = (canvas.width / 2);
    cube.y = (canvas.height / 2);
    
    //log time untill values
    timeToRock = ROCK_TIME;
    nextRock = nextBullet = 0;

    //reset key presses
    shootHeld =	lfHeld = rtHeld = fwdHeld = dnHeld = false;

    //ensure stage is blank and add the ship
    stage.clear();
    

    stage.addChild(barElement);
    stage.addChild(barElement2);
    stage.addChild(cube);

    //start game timer
    Ticker.addListener(window);
}

function tick() {
    //    //handle firing
    //    if(nextBullet <= 0) {
    //        if(alive && shootHeld){
    //            nextBullet = BULLET_TIME;
    //            fireBullet();
    //        }
    //    } else {
    //        nextBullet--;
    //    }

    //handle turning
    //    if(alive && lfHeld){
    //        ship.rotation -= TURN_FACTOR;
    //    } else if(alive && rtHeld) {
    //        ship.rotation += TURN_FACTOR;
    //    }

    //handle thrust
    if(alive && fwdHeld){
        barElement.accelerate(true);
        
    }
    
    //handle thrust
    if(alive && backHeld){
        barElement.accelerate(false);
        
    }

    //    //handle new spaceRocks
    //    if(nextRock <= 0) {
    //        if(alive){
    //            timeToRock -= DIFFICULTY;	//reduce spaceRock spacing slowly to increase difficulty with time
    //            var index = getSpaceRock(SpaceRock.LRG_ROCK);
    //            rockBelt[index].floatOnScreen(canvas.width, canvas.height);
    //            nextRock = timeToRock + timeToRock*Math.random();
    //        }
    //    } else {
    //        nextRock--;
    //    }

    //handle ship looping
    if(barElement.y <= barElement.bounds*-2) {
        barElement.canDown = false;
        barElement.y = barElement.bounds*-2;
    } else {
        barElement.canDown = true;
    }
    
    if(barElement.y >= canvas.height+barElement.bounds*2) {
        barElement.canUp = false;
        barElement.y = canvas.height+barElement.bounds*2
    } else {
        barElement.canUp = true;
    }
    console.log(cube.y + "  " + (canvas.height+cube.bounds*2));
    if(cube.y <= cube.bounds*-2) {
        cube.y = cube.bounds*-2;
        cube.vY = -cube.vY; 
    }

    if(cube.y > canvas.height+cube.bounds*2) {
        cube.vY = -cube.vY;
        cube.y = canvas.height+cube.bounds*2;
    }
    //    
    if(cube.x <= cube.bounds*-2) {
        
        cube.vX = -cube.vX; 
        cube.x = cube.bounds*-2;
    }
    ////    
    if(cube.x >= canvas.width+cube.bounds*2) {
        
        cube.vX = -cube.vX; 
        cube.x = canvas.width+cube.bounds*2;
    }
    //    //handle bullet movement and looping
    //    for(bullet in bulletStream) {
    //        var o = bulletStream[bullet];
    //        if(!o || !o.active) {
    //            continue;
    //        }
    //        if(outOfBounds(o, ship.bounds)) {
    //            placeInBounds(o, ship.bounds);
    //        }
    //        o.x += Math.sin(o.rotation*(Math.PI/-180))*BULLET_SPEED;
    //        o.y += Math.cos(o.rotation*(Math.PI/-180))*BULLET_SPEED;
    //
    //        if(--o.entropy <= 0) {
    //            stage.removeChild(o);
    //            o.active = false;
    //        }
    //    }
    //
    //    //handle spaceRocks (nested in one loop to prevent excess loops)
    //    for(spaceRock in rockBelt) {
    //        var o = rockBelt[spaceRock];
    //        if(!o || !o.active) {
    //            continue;
    //        }
    //
    //        //handle spaceRock movement and looping
    //        if(outOfBounds(o, o.bounds)) {
    //            placeInBounds(o, o.bounds);
    //        }
    //        o.tick();
    //
    //
    //        //handle spaceRock ship collisions
    //        if(alive && o.hitRadius(ship.x, ship.y, ship.hit)) {
    //            alive = false;
    //
    //            stage.removeChild(ship);
    //            messageField.text = "You're dead:  Click or hit enter to play again";
    //            stage.addChild(messageField);
    //            watchRestart();
    //
    //            //play death sound
    //            SoundJS.play("death", SoundJS.INTERRUPT_ANY);
    //            continue;
    //        }
    //
    //        //handle spaceRock bullet collisions
    //        for(bullet in bulletStream) {
    //            var p = bulletStream[bullet];
    //            if(!p || !p.active) {
    //                continue;
    //            }
    //
    //            if(o.hitPoint(p.x, p.y)) {
    //                var newSize;
    //                switch(o.size) {
    //                    case SpaceRock.LRG_ROCK:
    //                        newSize = SpaceRock.MED_ROCK;
    //                        break;
    //                    case SpaceRock.MED_ROCK:
    //                        newSize = SpaceRock.SML_ROCK;
    //                        break;
    //                    case SpaceRock.SML_ROCK:
    //                        newSize = 0;
    //                        break;
    //                }
    //
    //                //score
    //                if(alive) {
    //                    addScore(o.score);
    //                }
    //
    //                //create more
    //                if(newSize > 0) {
    //                    var i;
    //                    var index;
    //                    var offSet;
    //
    //                    for(i=0; i < SUB_ROCK_COUNT; i++){
    //                        index = getSpaceRock(newSize);
    //                        offSet = (Math.random() * o.size*2) - o.size;
    //                        rockBelt[index].x = o.x + offSet;
    //                        rockBelt[index].y = o.y + offSet;
    //                    }
    //                }
    //
    //                //remove
    //                stage.removeChild(o);
    //                rockBelt[spaceRock].active = false;
    //
    //                stage.removeChild(p);
    //                bulletStream[bullet].active = false;
    //
    //                // play sound
    //                SoundJS.play("break", SoundJS.INTERUPT_LATE, 0, 0.8);
    //            }
    //        }
    //    }

    //call sub ticks
    cube.tick();
    barElement.tick();
    stage.update();
}

function outOfBounds(o, bounds) {
    //is it visibly off screen
    
    return o.y < bounds*-2 || o.y > canvas.height+bounds*2 || o.x < bounds*-2 || o.x > canvas.width+bounds*2;;
}

function placeInBounds(o, bounds) {
    //if its visual bounds are entirely off screen place it off screen on the other side
    if(o.x > canvas.width+bounds*2) {
        o.x = bounds*-2;
    } else if(o.x < bounds*-2) {
        o.x = canvas.width+bounds*2;
    }

    //if its visual bounds are entirely off screen place it off screen on the other side
    if(o.y > canvas.height+bounds*2) {
        o.y = bounds*-2;
    } else if(o.y < bounds*-2) {
        o.y = canvas.height+bounds*2;
    }
}

function fireBullet() {
    //create the bullet
    var o = bulletStream[getBullet()];
    o.x = ship.x;
    o.y = ship.y;
    o.rotation = ship.rotation;
    o.entropy = BULLET_ENTROPY;
    o.active = true;

    //draw the bullet
    o.graphics.beginStroke("#FFFFFF").moveTo(-1, 0).lineTo(1, 0);

// play the shot sound
//SoundJS.play("laser", SoundJS.INTERUPT_LATE);
}

function getSpaceRock(size) {
    var i = 0;
    var len = rockBelt.length;

    //pooling approach
    while(i <= len){
        if(!rockBelt[i]) {
            rockBelt[i] = new SpaceRock(size);
            break;
        } else if(!rockBelt[i].active) {
            rockBelt[i].activate(size);
            break;
        } else {
            i++;
        }
    }

    if(len == 0) {
        rockBelt[0] = new SpaceRock(size);
    }

    stage.addChild(rockBelt[i]);
    return i;
}

function getBullet() {
    var i = 0;
    var len = bulletStream.length;

    //pooling approach
    while(i <= len){
        if(!bulletStream[i]) {
            bulletStream[i] = new Shape();
            break;
        } else if(!bulletStream[i].active) {
            bulletStream[i].active = true;
            break;
        } else {
            i++;
        }
    }

    if(len == 0) {
        bulletStream[0] = new Shape();
    }

    stage.addChild(bulletStream[i]);
    return i;
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
    //cross browser issues exist
    if(!e){
        var e = window.event;
    }

    switch(e.keyCode) {
        case KEYCODE_SPACE:
            shootHeld = true;
            return false;
        case KEYCODE_A:
        case KEYCODE_LEFT:
            lfHeld = true;
            return false;
        case KEYCODE_D:
        case KEYCODE_RIGHT:
            rtHeld = true;
            return false;
        case KEYCODE_W:
        case KEYCODE_UP:
            fwdHeld = true;
            return false;
        case KEYCODE_S:
        case KEYCODE_DOWN:
            backHeld = true;
            return false;
        case KEYCODE_ENTER:
            if(canvas.onclick == handleClick){
                handleClick();
            }
            return false;
    }
}

function handleKeyUp(e) {
    //cross browser issues exist
    if(!e){
        var e = window.event;
    }
    switch(e.keyCode) {
        case KEYCODE_SPACE:
            shootHeld = false;
            break;
        case KEYCODE_A:
        case KEYCODE_LEFT:
            lfHeld = false;
            break;
        case KEYCODE_D:
        case KEYCODE_RIGHT:
            rtHeld = false;
            break;
        case KEYCODE_S:
        case KEYCODE_DOWN:
            backHeld = false;
            break;
        case KEYCODE_W:
        case KEYCODE_UP:
            fwdHeld = false;
            break;
    }
}

function addScore(value) {
    //trust the field will have a number and add the score
    scoreField.text = (Number(scoreField.text) + Number(value)).toString();
}

