var gameSpace = document.getElementById('game');
var ctx = gameSpace.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const Game = function(){
    this.screenWidth = gameSpace.width;
    this.screenHeight = gameSpace.height;
    this.starField = [];
    this.playing = false;
    this.pMomentum = 1;
    this.fieldSize = 10;
    this.tick = 0;
    this.player = {
        x: gameSpace.width/2,
        y: gameSpace.height/2,
        s: 4,
        c: 'rgb(255,40,40)'
    }
    this.keys = {
        37: false, //left
        38: false, //up
        39: false, //right
        40: false,  //down
    }

    this.checkCollision = function(star){
        let circle1 = {radius: this.player.s, x: this.player.x, y: this.player.y};
        var circle2 = {radius: star.s, x: star.x, y: star.y};

        var dx = circle1.x - circle2.x;
        var dy = circle1.y - circle2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle1.radius + circle2.radius) {
            return true;
        }
        return false;
    }


    this._init = function(){
        ctx.fillStyle  = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
        for (let i = this.fieldSize; i >= 0; i--){
            let st = this.starFactory();
            this.starField.push(st);
            this.renderStar(st);
        }
    }

    this.move = function(star){
        if (this.keys[37]){
            star.x += Math.floor(star.v * this.pMomentum);
            if (star.x > this.screenWidth + (star.s/2)){
                star.x = 0 - star.s;
                star.y = randRange(this.screenHeight);
            }
        }
        if (this.keys[38]){
            star.y += Math.floor(star.v * this.pMomentum);
            if (star.y > this.screenHeight + (star.s/2)){
                star.y = 0 - star.s;
                star.x = randRange(this.screenWidth);
            }
        }
        if (this.keys[39]){
            star.x -= Math.floor(star.v * this.pMomentum);
            if (star.x < 0 - (star.s/2)){
                star.x = this.screenWidth + star.s;
                star.y = randRange(this.screenHeight);
            }
        }
        if (this.keys[40]){
            star.y -= Math.floor(star.v * this.pMomentum);
            if (star.y < 0 - (star.s/2)){
                star.y = this.screenHeight + star.s;
                star.x = randRange(this.screenWidth);
            }
        }
        if(this.checkCollision(star)){
            this.playing = false;
            this.keys[37] = false;
            this.keys[38] = false;
            this.keys[39] = false;
            this.keys[40] = false;
        }
    }

    this.renderStar = function(star){
        ctx.fillStyle = star.c;
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(star.x,star.y,star.s,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    this.starFactory = function(){
        let s = {
            x: randRange(this.screenWidth),
            y: randRange(this.screenHeight),
            c: `rgb(255,255,${randRange(255,50)})`,
            v: randRange(8,1),
            s: randRange(16,4)
        }

        return s;
    }

    function randRange( max, min = 0 ){
        return Math.floor(Math.random() * (max - min) + min);
    }
}

const itsAlive = new Game();
itsAlive._init();

document.addEventListener('keydown',function(e){
    let key = e.keyCode;
    itsAlive.keys.count++
    if (itsAlive.playing && (key === 37 || key === 39)){
        itsAlive.keys[key] = true;
        return
    }
    if (!itsAlive.playing && (key === 38 || key === 40)){
        itsAlive.playing = true;
        itsAlive.keys[key] = true;
    }
});

document.addEventListener('keyup',function(e){
    let key = e.keyCode;

    if (itsAlive.playing && (key === 37 || key === 39)){
        itsAlive.keys[key] = false;
    }
});

var draw = setInterval(function(){
    if (itsAlive.playing){
        itsAlive.tick++;
    }
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, itsAlive.screenWidth, itsAlive.screenHeight);
    ctx.fillStyle  = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, itsAlive.screenWidth, itsAlive.screenHeight);

    itsAlive.starField.forEach(function(i){
        itsAlive.move(i);
        itsAlive.renderStar(i);
    });

    if (itsAlive.tick > 299 && itsAlive.tick % 300 === 0){
        itsAlive.pMomentum += 0.25;
    }

    ctx.fillStyle = 'rgb(255,40,40)';
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gameSpace.width/2,gameSpace.height/2,4,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

},16)
