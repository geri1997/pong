const paddle1 = document.querySelector(".paddle1");
const paddle2 = document.querySelector(".paddle2");
const ball = document.querySelector(".ball");
const board = document.querySelector(".board");
const scoreH2 = document.querySelector(".score");
const pongSound = document.querySelector("audio");

const state = {
    board: {
        width: 720,
        height: 480,
    },
    ball: {
        top: 0,
        left: 0,
        width: 15,
        height: 15,
        direction: {
            x: 0,
            y: 0,
        },
        speed: 6,
    },
    paddle1: {
        width: 15,
        height: 75,
        top: 0,
        left: 5,
        score: 0,
        speed: 4,
        timeoutId: 0,
        turboRemaining: 1,
    },
    paddle2: {
        width: 15,
        height: 75,
        top: 0,
        right: 5,
        score: 0,
        speed: 4,
        timeoutId: 0,
        turboRemaining: 1,
    },
    keyboard: {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    },
    hasBall: 1,
    ballBounced: false,
    defaultSpeed: 4,
};
function initState() {
    state.paddle1.top = state.board.height / 2 - state.paddle1.height / 2;
    state.paddle2.top = state.board.height / 2 - state.paddle2.height / 2;
    state.ball.top =
        state.paddle1.top + state.paddle1.height / 2 - state.ball.height / 2;
    state.ball.direction.x = 0;
    state.ball.direction.y = 0;

    if (state.hasBall === 1) {
        state.ball.left = state.paddle1.left + state.paddle1.width + 1;
    }
    if (state.hasBall === 2) {
        state.ball.left =
            state.board.width -
            state.paddle2.right -
            state.paddle2.width -
            state.ball.width -
            1;
    }
    clearTimeout(state.paddle1.timeoutId);
    clearTimeout(state.paddle2.timeoutId);
    state.paddle1.speed = state.defaultSpeed;
    state.paddle2.speed = state.defaultSpeed;
    state.paddle1.turboRemaining = 1;
    state.paddle2.turboRemaining = 1;
}
function init() {
    initState();
    document.addEventListener("keydown", (e) => {
        if (state.keyboard.hasOwnProperty(e.key)) {
            state.keyboard[e.key] = true;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "e" && state.paddle1.turboRemaining > 0) {
            state.paddle1.speed *= 2;
            state.paddle1.timeoutId = setTimeout(
                () => (state.paddle1.speed = state.defaultSpeed),
                3000
            );
            state.paddle1.turboRemaining--;
        }
        if (e.key === "/" && state.paddle2.turboRemaining > 0) {
            state.paddle2.speed *= 2;
            setTimeout(() => (state.paddle2.speed = state.defaultSpeed), 3000);
            state.paddle2.turboRemaining--;
        }
        if (state.keyboard.hasOwnProperty(e.key)) {
            state.keyboard[e.key] = false;
        }
    });
}

function render() {
    paddle1.style.top = state.paddle1.top + "px";
    paddle2.style.top = state.paddle2.top + "px";
    ball.style.top = state.ball.top + "px";
    ball.style.left = state.ball.left + "px";
    if (state.paddle1.speed > state.defaultSpeed) {
        paddle1.classList.add("turbo");
    } else if (state.paddle1.speed === state.defaultSpeed) {
        paddle1.classList.remove("turbo");
    }
    if (state.paddle2.speed > state.defaultSpeed) {
        paddle2.classList.add("turbo");
    } else if (state.paddle2.speed === state.defaultSpeed) {
        paddle2.classList.remove("turbo");
    }
    renderScore();
}

function movePaddle(paddle, offset) {
    state[paddle].top += offset * state[paddle].speed;
}

function update() {
    state.ballBounced = false;
    updatePaddles();
    updateBall();
    if (checkIfLost()) {
        updateScore();
        initState();
    }
}
function updateScore() {
    if (state.ball.left < state.board.width / 2) {
        state.paddle2.score += 1;
        state.hasBall = 1;
    }
    if (state.ball.left > state.board.width / 2) {
        state.paddle1.score += 1;
        state.hasBall = 2;
    }
}
function updatePaddles() {
    if (state.keyboard.w) {
        movePaddle("paddle1", -1);
        if (state.ball.direction.x === 0 && state.hasBall===1) {
            state.ball.direction.x = 1;
            state.ball.direction.y = -1;
        }
    }
    if (state.keyboard.s) {
        movePaddle("paddle1", 1);
        if (state.ball.direction.x === 0 && state.hasBall===1) {
            state.ball.direction.x = 1;
            state.ball.direction.y = 1;
        }
    }
    // if(state.)
    if (state.keyboard.ArrowDown) {
        movePaddle("paddle2", 1);
        if (state.ball.direction.x === 0 && state.hasBall===2) {
            state.ball.direction.x = -1;
            state.ball.direction.y = 1;
        }
    }
    if (state.keyboard.ArrowUp) {
        movePaddle("paddle2", -1);
        if (state.ball.direction.x === 0 && state.hasBall===2) {
            state.ball.direction.x = -1;
            state.ball.direction.y = -1;
        }
    }
    checkPaddleBorderCollision();
}

function checkPaddleBorderCollision() {
    if (state.paddle1.top < 0) {
        state.paddle1.top = 0;
    }
    if (state.paddle1.top > state.board.height - state.paddle1.height) {
        state.paddle1.top = state.board.height - state.paddle1.height;
    }
    if (state.paddle2.top < 0) {
        state.paddle2.top = 0;
    }
    if (state.paddle2.top > state.board.height - state.paddle2.height) {
        state.paddle2.top = state.board.height - state.paddle2.height;
    }
}

function updateBall() {
    state.ball.left += state.ball.direction.x * state.ball.speed;
    state.ball.top += state.ball.direction.y * state.ball.speed;
    checkBallCollision();
}

function ballBorderCollision() {
    if (state.ball.top <= 0) {
        state.ball.top = 0;
        state.ball.direction.y = 1;
    }
    if (state.ball.top + state.ball.height >= state.board.height) {
        state.ball.top = state.board.height - state.ball.height;
        state.ball.direction.y = -1;
    }
}

function paddle1Collision() {
    return (
        state.ball.left < state.paddle1.left + state.paddle1.width &&
        state.ball.top + state.ball.height / 2 > state.paddle1.top &&
        state.ball.top + state.ball.height / 2 <
            state.paddle1.top + state.paddle1.height
    );
}
function paddle2Collision() {
    return (
        state.ball.left + state.ball.width >
            state.board.width - state.paddle2.right - state.paddle2.width &&
        state.ball.top + state.ball.height / 2 > state.paddle2.top &&
        state.ball.top + state.ball.height / 2 <
            state.paddle2.top + state.paddle2.height
    );
}
function renderScore() {
    scoreH2.textContent = `${state.paddle1.score} - ${state.paddle2.score}`;
}
function checkBallCollision() {
    if (paddle1Collision()) {
        state.ballBounced = true;
        state.ball.direction.x = 1;

        if (state.keyboard.w) {
            state.ball.direction.y = -1;
        } else if (state.keyboard.s) {
            state.ball.direction.y = 1;
        }
        state.ball.left = state.paddle1.left + state.paddle1.width;
    } else if (paddle2Collision()) {
        state.ballBounced = true;
        state.ball.direction.x = -1;
        if (state.keyboard.ArrowUp) {
            state.ball.direction.y = -1;
        } else if (state.keyboard.ArrowDown) {
            state.ball.direction.y = 1;
        }
        state.ball.left =
            state.board.width -
            state.paddle2.right -
            state.paddle2.width -
            state.ball.width;
    }
    ballBorderCollision();
}
function checkIfLost() {
    return (
        state.ball.left < state.paddle1.left + state.paddle1.width / 2 ||
        state.ball.left + state.ball.width >
            state.board.width - state.paddle2.right - state.paddle2.width / 2
    );
}

function playSound() {
    if (state.ballBounced) {
        pongSound.play();
    }
}

function main() {
    init();
    setInterval(() => {
        update();
        render();
        playSound();
    }, 1000 / 30);
}

main();
