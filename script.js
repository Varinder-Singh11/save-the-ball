const svg = document.getElementById('gameArea');
const player = document.getElementById('player');
const gameWidth = svg.clientWidth;
const gameHeight = svg.clientHeight;
const playerRadius = 20;
let playerY = gameHeight / 2;
let score = 0;
let gameAnimation;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
};

const hurdles = [];


function start(){
    window.location.reload();
}

function createHurdle() {
    const hurdlesHeight = 40;
    const hurdlesWidth = 20;
    const hurdlesY = Math.random() * (gameHeight - hurdlesHeight);

    const hurdle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    hurdle.setAttribute("x", gameWidth);
    hurdle.setAttribute("y", hurdlesY);
    hurdle.setAttribute("width",hurdlesWidth);
    hurdle.setAttribute("height", hurdlesHeight);
    hurdle.setAttribute("fill", "yellow");

    svg.appendChild(hurdle);
    hurdles.push(hurdle);
}

function movePlayer() {
    if (keys.ArrowUp && playerY - playerRadius > 0) {
        playerY -= 5;
    }
    if (keys.ArrowDown && playerY + playerRadius < gameHeight) {
        playerY += 5;
    }
    player.setAttribute('cy', playerY);
}

function moveHurdle() {
    let gameArea = document.getElementById('gameArea');

    hurdles.forEach((hurdle, index) => {
        let x = parseFloat(hurdle.getAttribute('x')) - 5;
        if (x + parseFloat(hurdle.getAttribute('width')) < 0) {
            svg.removeChild(hurdle);
            hurdles.splice(index, 1);
            score++;
            setScore();
        } else {
            hurdle.setAttribute('x', x);

            if (detectTouch(hurdle)) {
                gameEnd();
                gameArea.innerHTML = '';
                cancelAnimationFrame(gameAnimation);
            }
        }
    });
}

function setScore(){
    document.getElementById('score').innerHTML = score;
}

function gameEnd(){
    document.getElementById('game-end-score').innerHTML = score;
    document.getElementById('gameEndMessage').style.visibility = 'visible';

    setTimeout(() => {
        document.getElementById('gameEndMessage').style.visibility = 'hidden';
        score = 0;
        setScore();
    }, 5000);
}

function detectTouch(hurdle) {
    const hurdleX = parseFloat(hurdle.getAttribute('x'));
    const hurdleY = parseFloat(hurdle.getAttribute('y'));
    const hurdleWidth = parseFloat(hurdle.getAttribute('width'));
    const hurdleHeight = parseFloat(hurdle.getAttribute('height'));

    const distX = Math.abs(hurdleX + hurdleWidth / 2 - parseFloat(player.getAttribute('cx')));
    const distY = Math.abs(hurdleY + hurdleHeight / 2 - parseFloat(player.getAttribute('cy')));

    if (distX <= hurdleWidth / 2 + playerRadius && distY <= hurdleHeight / 2 + playerRadius) {
        return true;
    }
    return false;
}

function gameInLoop() {
    movePlayer();
    moveHurdle();
    if (Math.random() < 0.02) {
        createHurdle();
    }
    gameAnimation = requestAnimationFrame(gameInLoop);
}

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

gameInLoop();