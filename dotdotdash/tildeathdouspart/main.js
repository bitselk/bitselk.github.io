var init = document.querySelector(".initscreen");
var initText = document.querySelector(".initscreen span");
var terminal = document.querySelector(".terminal");

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// redirect on window too small
if (window.matchMedia("screen and (max-width: 760px)").matches) {
	window.location.href = "death.html";
}

// canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight + 1;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// for movement
let keys = {};
var rotX = 0;
var rotY = 0;

// globals
let audio;
let sfx;
let stageSound = "sounds/stage.wav";

// pointer lock object forking for cross browser
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

// remove init screen
init.onclick = function () {
	init.remove();
	terminalFunc();
}
initText.onclick = function () {
	init.remove();
	terminalFunc();
}
// remove intro prompt
terminal.onclick = function () {
	terminal.remove();
	canvas.requestPointerLock();
	main();
}
// re-lock
canvas.onclick = function () {
	canvas.requestPointerLock();
}

// key event listeners
document.body.addEventListener('keypress', keydown);    
document.body.addEventListener('keyup', keyup); 
function keydown(e) {
    if(!keys[e.code]) keys[e.code] = true;
}
function keyup(e) {
    if(keys[e.code]) keys[e.code] = false;
}

// pointer lock event listeners
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
function lockChangeAlert() {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		document.addEventListener("mousemove", updatePosition, false);
	} else {
		document.removeEventListener("mousemove", updatePosition, false);
	}
}

let captions = document.querySelector(".captionwrapper p");
let subtext = document.querySelector(".captionwrapper .subtext");

function updatePosition(e) {
	rotX += e.movementX;
	rotY += e.movementY;

	//captions.textContent = x + ", " + y;
}

const sleepUntil = async (f, timeoutMs = 0) => {
    return new Promise((resolve, reject) => {
        const timeWas = new Date();
        const wait = setInterval(function() {
            if (f()) {
                clearInterval(wait);
                resolve();
            } else if (timeoutMs != 0 && new Date() - timeWas > timeoutMs) { // Timeout
                clearInterval(wait);
                reject();
            }
        }, 20);
    });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function terminalFunc() {
	audio = new Audio('sounds/terminalstart.wav');
	audio.play();
	await delay(6200);
	terminal.style.display = "block";

	audio.addEventListener('ended', function() {
        audio = new Audio("sounds/terminalloop.wav");
		audio.play();

		if (typeof audio.loop == 'boolean') {
    		audio.loop = true;
		} else {
    		audio.addEventListener('ended', loop, false);
		}
	}, false);
}
function loop() {
	this.currentTime = 0;
	this.play();
}

async function main() {
	audio.removeEventListener('ended', loop);
	audio.pause();
	await delay(4000);
	let rainMaxVol = 0.3;

	let rain = setTimeout(function() {
		audio = new Audio("sounds/background.wav");
		audio.volume = 0;
		audio.play();

		let vol = 0;
		let increasingAmbience = setInterval(function() {
			vol += 0.05;
			if(vol >= rainMaxVol) {
				clearInterval(increasingAmbience);
			} else {
				audio.volume = vol;
			}
		}, 100);

		if (typeof audio.loop == 'boolean') {
    		audio.loop = true;
		} else {
    		audio.addEventListener('ended', loop, false);
		}
	}, 3000)

	// cem => maus
	captions.textContent = "hold [W] to walk forward";
	subtext.textContent = "for 50.0 more meters";
	await stageKey("meters", 5000, 135, "KeyW", 100);
	await clearAndWait(1000);

	captions.textContent = "move mouse [RIGHT] to rotate";
	subtext.textContent = "for 90 more degrees";
	await stageRot(90);
	await clearAndWait(1000);

	captions.textContent = "hold [W] to walk forward";
	subtext.textContent = "for 76.2 more meters";
	await stageKey("meters", 7620, 135, "KeyW", 100);
	await clearAndWait(1000);

	captions.textContent = "move mouse [LEFT] to rotate";
	subtext.textContent = "for 42 more degrees";
	await stageRot(42, true);
	await clearAndWait(1000);

	captions.textContent = "hold [W] to walk forward";
	subtext.textContent = "for 8.2 more meters";
	await stageKey("meters", 820, 135, "KeyW", 100);
	await clearAndWait(1000);

	// enter maus
	captions.textContent = "hold [L] to pick the lock";
	subtext.textContent = "for 12 more seconds";
	await stageKey("seconds", 12, 1, "KeyL", 1, 1000);
	await clearAndWait(1000);

	captions.textContent = "hold [D] to open the door";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyD", 1, 1000);
	await clearAndWait(2000);

	stageSound = "sounds/stagewrong.wav";

	captions.textContent = "hold [W] to walk forward";
	subtext.textContent = "for 3 more meters";
	await stageKey("meters", 300, 135, "KeyW", 100);
	await clearAndWait(1000);

	let vol = rainMaxVol;
	let decreasingAmbience = setInterval(function() {
		vol -= 0.05;
		if(vol <= 0) {
			audio.pause();
			audio.volume = 1;
			audio.removeEventListener('ended', loop);
			clearTimeout(rain);
			clearInterval(decreasingAmbience);
		} else {
			audio.volume = vol;
		}
	}, 100);

	captions.textContent = "move mouse [LEFT] to turn around";
	subtext.textContent = "for 180 more degrees";
	await stageRot(180, true);
	await clearAndWait(3000);

	captions.textContent = "hold [L] to lock the door";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyL", 1, 1000);
	await clearAndWait(1000);

	// ins maus
	captions.textContent = "move mouse [RIGHT] to turn back";
	subtext.textContent = "for 180 more degrees";
	await stageRot(180);
	await clearAndWait(3000);

	captions.innerHTML = "hold [L] to <span style=\"color:red\">He's not really dead, you know</span>";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyL", 1, 1000);

	captions.innerHTML = "hold [A] to <span style=\"color:red\">just waiting</span>";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyA", 1, 1000);

	nextStage();

	captions.innerHTML = "hold [I] to <span style=\"color:red\">waiting for you</span>";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyI", 1, 1000);

	nextStage();

	captions.innerHTML = "hold [R] to <span style=\"color:red\">i'm sorry, i really am</span>";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyR", 1, 1000);

	nextStage();

	captions.innerHTML = "hold [D] to <span style=\"color:red\">but He must be starving.</span>";
	subtext.textContent = "for 3 more seconds";
	await stageKey("seconds", 3, 1, "KeyD", 1, 1000);

	nextStage();

	sfx = new Audio("sounds/stagewrong.wav");
	sfx.play();
	captions.innerHTML = "hold [S] to <span style=\"color:red\">███████████</span>";
	subtext.textContent = "for more seconds";
	
	setInterval(function() {
		if(keys["KeyS"]) {
			sfx.play();
		}
	}, 100);
	setTimeout(function() {
		window.location.href = "https://www.findagrave.com/memorial/107973333/laird-smith";
	}, 5000);
}

function scaleToFit(img){
    // get the scale
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
    // get the top left position of the image
    var x = (canvas.width / 2) - (img.width / 2) * scale;
    var y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

let n = 1;
function nextStage() {
	var img = new Image;
	img.onload = function(){
  		scaleToFit(this);
	};
	img.src = `images/mausoleum/stage${n}.png`;
	n++;
}

async function stageKey(reqName, reqQuant, reqDecRate, reqKey, division = 1, check = 100) {
	sfx = new Audio(stageSound);
	sfx.play();
	return new Promise(function(resolve) {
		let requirement = reqQuant;
		let interval = setInterval(function() {
			if(keys[reqKey]) {
				requirement -= reqDecRate;
				if(requirement <= 0) {
					clearInterval(interval);
					requirement = 0;
					resolve();
				} else {
					subtext.textContent = `for ${requirement/division} more ${reqName}`;
				}
			}
		}, check);
	})
}
async function stageRot(degQuant, left = false) {
	sfx = new Audio(stageSound);
	sfx.play();
	rotX = 0;
	let mult = left ? -1 : 1;

	return new Promise(function(resolve) {
		let requirement = degQuant * 10 * 2;
		let interval = setInterval(function() {
			if(requirement - (rotX * mult) < 0) {
				clearInterval(interval);
				requirement = 0;
				subtext.textContent = `for 0 more degrees`;
				resolve()
			} else {
				subtext.textContent = `for ${(requirement - (rotX*mult))/20} more degrees`;
			}
		}, 100);
	});
}
async function clearAndWait(ms) {
	captions.textContent = "";
	subtext.textContent = "";
	await delay(ms);
}