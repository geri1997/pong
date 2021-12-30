const paddle1 = document.querySelector(".paddle1");
const paddle2 = document.querySelector(".paddle2");
const ball = document.querySelector(".ball");
const board = document.querySelector(".board");

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
        direction: 1,
        speed: 6,
    },
    paddle1: {
        width: 15,
        height: 75,
        top: 0,
        left: 5,
    },
    paddle2: {
        width: 15,
        height: 75,
        top: 0,
        right: 5,
    },
    keyboard: {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    },
    speed: 4,
};
function initState() {
    state.paddle1.top = state.board.height / 2 - state.paddle1.height / 2;
    state.paddle2.top = state.board.height / 2 - state.paddle2.height / 2;
    state.ball.top =
        state.paddle1.top + state.paddle1.height / 2 - state.ball.height / 2;
    state.ball.left = state.paddle1.left + state.paddle1.width + 10;
    state.ball.direction = 1;
}
function init() {
    initState();
    document.addEventListener("keydown", (e) => {
        if (state.keyboard.hasOwnProperty(e.key)) {
            state.keyboard[e.key] = true;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (state.keyboard.hasOwnProperty(e.key)) {
            state.keyboard[e.key] = false;
        }
    });
    // document.addEventListener('key',e=>movePaddle(paddle2))
}

function render() {
    paddle1.style.top = state.paddle1.top + "px";
    paddle2.style.top = state.paddle2.top + "px";
    ball.style.top = state.ball.top + "px";
    ball.style.left = state.ball.left + "px";
}

function movePaddle(paddle, offset) {
    state[paddle].top += offset * state.speed;
}

function update() {
    updatePaddles();
    updateBall();
    if (checkIfLost()) {
        initState();
    }
}
function updatePaddles() {
    if (state.keyboard.w) {
        movePaddle("paddle1", -1);
    }
    if (state.keyboard.s) {
        movePaddle("paddle1", 1);
    }
    if (state.keyboard.ArrowDown) {
        movePaddle("paddle2", 1);
    }
    if (state.keyboard.ArrowUp) {
        movePaddle("paddle2", -1);
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
    state.ball.left += state.ball.direction * state.ball.speed;
    checkBallCollision();
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
function checkBallCollision() {
    if (paddle1Collision()) {
        state.ball.direction = 1;
    } else if (paddle2Collision()) {
        state.ball.direction = -1;
    }
}
function checkIfLost() {
    return (
        state.ball.left < state.paddle1.left + state.paddle1.width / 2 ||
        state.ball.left + state.ball.width >
            state.board.width - state.paddle2.right - state.paddle2.width / 2
    );
}

function main() {
    init();
    setInterval(() => {
        update();
        render();
    }, 1000 / 30);
}

main();
