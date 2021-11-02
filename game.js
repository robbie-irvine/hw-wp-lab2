function Bear() {
    this.dBear = 100;
    this.htmlElement = document.getElementById("bear");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;

    this.move = function(xDir, yDir) {
        this.x += this.dBear * xDir;
        this.y += this.dBear * yDir;
        this.fitBounds(); // keeps bear within board
        this.display();
    };

    this.display = function() {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "absolute";
    };

    this.fitBounds = function() {
        let parent = this.htmlElement.parentElement;
        let iw = this.htmlElement.offsetWidth;
        let ih = this.htmlElement.offsetHeight;
        let l = parent.offsetLeft;
        let t = parent.offsetTop;
        let w = parent.offsetWidth;
        let h = parent.offsetHeight;

        if (this.x < 0) this.x = 0;
        if (this.x > w - iw) this.x = w - iw;
        if (this.y < 0) this.y = 0;
        if (this.y > h - ih) this.y = h - ih;
    };

    this.setSpeed = function() {
        let dBear = document.getElementById("speedBear").value;
        this.dBear = Number(dBear);
    };
}

class Bee {
    constructor(BeeNumber) {
        // the HTML element corresponding to the image of the bee
        this.htmlElement = createBeeImg(BeeNumber);
        //iits HTML ID 
        this.id = this.htmlElement.id; 
        //the left position (x)
        this.x = this.htmlElement.offsetLeft; 
        //the top position (y) 
        this.y = this.htmlElement.offsetTop;

        this.move = function(dx, dy) {
            // move the bees by dx, dy
            this.x += dx;
            this.y += dy;
            this.display();
        };

        this.display = function() {
            // adjust position of bee and display it
            this.fitBounds(); // add this to adjust to bounds
            this.htmlElement.style.left = this.x + "px";
            this.htmlElement.style.top = this.y + "px";
            this.htmlElement.style.display = "block";
        };

        this.fitBounds = function() {
            let parent = this.htmlElement.parentElement;
            let iw = this.htmlElement.offsetWidth;
            let ih = this.htmlElement.offsetHeight;
            let l = parent.offsetLeft;
            let t = parent.offsetTop;
            let w = parent.offsetWidth;
            let h = parent.offsetHeight;
    
            if (this.x < 0) this.x = 0;
            if (this.x > w - iw) this.x = w - iw;
            if (this.y < 0) this.y = 0;
            if (this.y > h - ih) this.y = h - ih;
        };
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function start() {
    clearTimeout(updateTimer);
    if (document.getElementById("gameOverText") != null) document.getElementById("gameOverText").remove();
    //
    document.getElementById("hits").innerHTML = 0;
    //
    document.getElementById("duration").innerHTML = 0;
    // Create bear
    bear = new Bear();
    // Get bear speed specified by the user
    bear.setSpeed();
    // Add an event listener to the keypress event
    document.addEventListener("keydown", moveBear, false);
    // Initialise lastStingTime when bear moves
    document.addEventListener("keydown", stingInit, false);
    // remove all bees visible
    clearBees();
    // Create new array for bees
    bees = new Array();
    // create bees
    makeBees();
    // start bee update script
    updateBees();
}

function stingInit(e) {
    lastStingTime = new Date();
    document.removeEventListener("keydown", stingInit);
}

// Handle keyboard events to move the bear
function moveBear(e) {
    // codes of the four keys
    const KEYLEFT = 37;
    const KEYUP = 38;
    const KEYRIGHT = 39;
    const KEYDOWN = 40;
    
    // left key
    if (e.keyCode == KEYLEFT) {
        bear.move(-1, 0);
    }
    
    // right key
    if (e.keyCode == KEYRIGHT) {
        bear.move(1, 0);
    }
    
    // up key
    if (e.keyCode == KEYUP) {
        bear.move(0, -1);
    }
    
    // down key
    if (e.keyCode == KEYDOWN) {
        bear.move(0, 1);
    }
}

function makeBees() {
    // get num of bees specified by user
    let nbBees = document.getElementById("nbBees").value;
    nbBees = Number(nbBees); // try converting the content of the input to a number

    if (isNaN(nbBees)) {
        window.alert("Invalid number of bees");
        return;
    }

    // create bees
    for (let i = 1; i <= nbBees; i++) {
        var num = i;
        var bee = new Bee(num);
        bee.display(); // display the bee
        bees.push(bee); // add the bee object to the bees array
    }
}

function addBee() {
    var bee = new Bee(bees.length + 1);
    bee.display();
    bees.push(bee);
}

function clearBees() { // deletes all bees on board
    if (bees != null) {
        for (let i = 1; i <= bees.length; i++) {
            document.getElementById("bee" + i).remove();
        }
    }
    
}

function createBeeImg(wNum) {
    // get dimension and position of board div
    let boardDiv = document.getElementById("board");
    let boardDivW = boardDiv.offsetWidth;
    let boardDivH = boardDiv.offsetHeight;
    let boardDivX = boardDiv.offsetLeft;
    let boardDivY = boardDiv.offsetTop;

    // create the IMG element
    let img = document.createElement("img");
    img.setAttribute("src", "images/bee.gif");
    img.setAttribute("width", "100");
    img.setAttribute("alt", "A bee");
    img.setAttribute("id", "bee" + wNum);
    img.setAttribute("class", "bee"); // set class of html tag img

    // add the IMG element to the DOM as a child of the board div
    img.style.position = "absolute";
    boardDiv.appendChild(img);

    // set initial position
    let x = getRandomInt(boardDivW);
    let y = getRandomInt(boardDivH);

    img.style.left = (boardDivX + x) + "px"
    img.style.top = (y) + "px"

    // return the img object
    return img;
}

function moveBees() {
    // get speed input value
    let speed = document.getElementById("speedBees").value;
    // move each bee to a random location
    for (let i = 0; i < bees.length; i++) {
        let dx = getRandomInt(2 * speed) - speed;
        let dy = getRandomInt(2 * speed) - speed;
        bees[i].move(dx, dy);
        isHit(bees[i], bear); // counts stings
    }
}

function updateBees() { // update loop for game
    // move bees randomly
    moveBees();
    // use a fixed update period
    let period = document.getElementById("periodTimer").value; // controls refresh period
    period = Number(period);
    if (hits.innerHTML < 1000) {
        // update the timer for the next move
        updateTimer = setTimeout("updateBees()", period);
    } else {
        clearTimeout(updateTimer);
        showGameOver();
    }
}

function isHit(defender, offender) {
    if (overlap(defender, offender)) { // check if the two images overlap
        let score = hits.innerHTML;
        score = Number(score) + 1; // increment the score
        hits.innerHTML = score; // display the new score
        
        // calculate longest duration
        let newStingTime = new Date();
        let thisDuration = newStingTime - lastStingTime;
        lastStingTime = newStingTime;
        let longestDuration = Number(duration.innerHTML);

        if (longestDuration == 0) {
            longestDuration = thisDuration;
        } else {
            if (longestDuration < thisDuration) longestDuration = thisDuration;
        }

        document.getElementById("duration").innerHTML = longestDuration;
        
    }
}

function overlap(element1, element2) {
    // consider the two rectangles wrapping the two elements
    // rectangle of the first element
    left1 = element1.htmlElement.offsetLeft;
    top1 = element1.htmlElement.offsetTop;
    right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth;
    bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight;

    // rectangle of the second element
    left2 = element2.htmlElement.offsetLeft;
    top2 = element2.htmlElement.offsetTop;
    right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
    bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight;

    // calculate the intersection of the two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
    intersectArea = x_intersect * y_intersect;

    // if intersection is nil no hit
    if (intersectArea == 0 || isNaN(intersectArea)) {
        return false;
    }
    return true;
}

function showGameOver() {
    let gameOverText = document.createElement("h1");
    gameOverText.textContent = "Game Over!";
    gameOverText.setAttribute("id", "gameOverText");
    let boardDiv = document.getElementById("board");
    boardDiv.appendChild(gameOverText);
}