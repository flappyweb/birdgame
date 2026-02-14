// Flappy Bird Game - .GEARS Edition
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
let gameState = 'start'; // start, playing, gameover
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;

// 새 (Bird)
const bird = {
    x: 50,
    y: 200,
    width: 34,
    height: 24,
    gravity: 0.5,
    velocity: 0,
    jump: -8,
    rotation: 0
};

// 파이프
let pipes = [];
const pipeWidth = 52;
const pipeGap = 120;
const pipeSpeed = 2;
let pipeTimer = 0;
const pipeInterval = 90;

// 바닥
const ground = {
    x: 0,
    y: canvas.height - 80,
    width: canvas.width,
    height: 80
};

// 로고 이미지 로드
const logoImg = new Image();
logoImg.src = 'assets/files/assets/32749218/1/logo.png';
let logoLoaded = false;
logoImg.onload = () => { logoLoaded = true; };
logoImg.onerror = () => { logoLoaded = false; };

// 색상
const colors = {
    bird: '#FFD700',
    birdOutline: '#FFA500',
    pipeBody: '#73BF2E',
    pipeOutline: '#557B20',
    pipeCap: '#73BF2E',
    pipeCapOutline: '#557B20',
    ground: '#DED895',
    groundPattern: '#D2B86A',
    text: '#FFF',
    textShadow: '#543847'
};

// 새 그리기
function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

    // 회전 (속도에 따라)
    let rotation = Math.min(bird.velocity * 3, 90) * Math.PI / 180;
    ctx.rotate(rotation);

    // 몸통
    ctx.fillStyle = colors.bird;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.birdOutline;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 눈
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(8, -4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    // 부리
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, 3);
    ctx.lineTo(15, 6);
    ctx.closePath();
    ctx.fill();

    // 날개
    ctx.fillStyle = colors.birdOutline;
    ctx.beginPath();
    ctx.ellipse(-5, 5, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// 파이프 그리기
function drawPipe(pipe) {
    // 위쪽 파이프
    ctx.fillStyle = colors.pipeBody;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.strokeStyle = colors.pipeOutline;
    ctx.lineWidth = 3;
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);

    // 위쪽 파이프 캡
    ctx.fillStyle = colors.pipeCap;
    ctx.fillRect(pipe.x - 3, pipe.topHeight - 26, pipeWidth + 6, 26);
    ctx.strokeRect(pipe.x - 3, pipe.topHeight - 26, pipeWidth + 6, 26);

    // 아래쪽 파이프
    const bottomY = pipe.topHeight + pipeGap;
    ctx.fillStyle = colors.pipeBody;
    ctx.fillRect(pipe.x, bottomY, pipeWidth, canvas.height - bottomY - ground.height);
    ctx.strokeStyle = colors.pipeOutline;
    ctx.strokeRect(pipe.x, bottomY, pipeWidth, canvas.height - bottomY - ground.height);

    // 아래쪽 파이프 캡
    ctx.fillStyle = colors.pipeCap;
    ctx.fillRect(pipe.x - 3, bottomY, pipeWidth + 6, 26);
    ctx.strokeRect(pipe.x - 3, bottomY, pipeWidth + 6, 26);
}

// 바닥 그리기
function drawGround() {
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, ground.y, canvas.width, ground.height);

    // 바닥 패턴
    ctx.fillStyle = colors.groundPattern;
    for (let i = 0; i < canvas.width; i += 24) {
        ctx.fillRect(i, ground.y, 12, 15);
    }

    // 바닥 선
    ctx.strokeStyle = '#543847';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, ground.y);
    ctx.lineTo(canvas.width, ground.y);
    ctx.stroke();
}

// 배경 그리기
function drawBackground() {
    // 하늘
    const gradient = ctx.createLinearGradient(0, 0, 0, ground.y);
    gradient.addColorStop(0, '#4EC0CA');
    gradient.addColorStop(1, '#71C5CF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, ground.y);

    // 구름
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(50, 80, 40);
    drawCloud(180, 120, 35);
    drawCloud(280, 60, 30);
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

// 점수 그리기
function drawScore() {
    ctx.fillStyle = colors.textShadow;
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score, canvas.width / 2 + 2, 52);

    ctx.fillStyle = colors.text;
    ctx.fillText(score, canvas.width / 2, 50);
}

// 시작 화면
function drawStartScreen() {
    drawBackground();
    drawGround();

    // 로고
    if (logoLoaded) {
        const logoWidth = 150;
        const logoHeight = 40;
        ctx.drawImage(logoImg, canvas.width / 2 - logoWidth / 2, 80, logoWidth, logoHeight);
    } else {
        ctx.fillStyle = '#C0392B';
        ctx.fillRect(canvas.width / 2 - 75, 80, 150, 40);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('.GEARS', canvas.width / 2, 107);
    }

    // 타이틀
    ctx.fillStyle = colors.textShadow;
    ctx.font = 'bold 36px Arial';
    ctx.fillText('FLAPPY BIRD', canvas.width / 2 + 2, 172);
    ctx.fillStyle = colors.text;
    ctx.fillText('FLAPPY BIRD', canvas.width / 2, 170);

    // 새 미리보기
    bird.y = 220 + Math.sin(Date.now() / 200) * 10;
    bird.x = canvas.width / 2 - bird.width / 2;
    drawBird();
    bird.x = 50;

    // 안내
    ctx.fillStyle = colors.textShadow;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('터치 또는 스페이스바', canvas.width / 2 + 1, 322);
    ctx.fillStyle = colors.text;
    ctx.fillText('터치 또는 스페이스바', canvas.width / 2, 320);

    ctx.fillStyle = colors.textShadow;
    ctx.font = '16px Arial';
    ctx.fillText('최고 점수: ' + highScore, canvas.width / 2 + 1, 362);
    ctx.fillStyle = '#FFD700';
    ctx.fillText('최고 점수: ' + highScore, canvas.width / 2, 360);
}

// 게임오버 화면
function drawGameOver() {
    // 반투명 오버레이
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 게임오버 텍스트
    ctx.fillStyle = '#C0392B';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2 + 2, 182);
    ctx.fillStyle = '#FFF';
    ctx.fillText('GAME OVER', canvas.width / 2, 180);

    // 점수
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = colors.textShadow;
    ctx.fillText('점수: ' + score, canvas.width / 2 + 1, 232);
    ctx.fillStyle = '#FFF';
    ctx.fillText('점수: ' + score, canvas.width / 2, 230);

    // 최고 점수
    ctx.fillStyle = colors.textShadow;
    ctx.fillText('최고: ' + highScore, canvas.width / 2 + 1, 272);
    ctx.fillStyle = '#FFD700';
    ctx.fillText('최고: ' + highScore, canvas.width / 2, 270);

    // 다시 시작
    ctx.font = '18px Arial';
    ctx.fillStyle = colors.textShadow;
    ctx.fillText('터치하여 다시 시작', canvas.width / 2 + 1, 332);
    ctx.fillStyle = '#FFF';
    ctx.fillText('터치하여 다시 시작', canvas.width / 2, 330);
}

// 파이프 생성
function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - ground.height - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        passed: false
    });
}

// 충돌 감지
function checkCollision() {
    // 바닥/천장 충돌
    if (bird.y + bird.height > ground.y || bird.y < 0) {
        return true;
    }

    // 파이프 충돌
    for (let pipe of pipes) {
        // 새의 바운딩 박스 (약간 작게)
        const birdBox = {
            x: bird.x + 4,
            y: bird.y + 4,
            width: bird.width - 8,
            height: bird.height - 8
        };

        // 위쪽 파이프
        if (birdBox.x < pipe.x + pipeWidth &&
            birdBox.x + birdBox.width > pipe.x &&
            birdBox.y < pipe.topHeight) {
            return true;
        }

        // 아래쪽 파이프
        const bottomPipeY = pipe.topHeight + pipeGap;
        if (birdBox.x < pipe.x + pipeWidth &&
            birdBox.x + birdBox.width > pipe.x &&
            birdBox.y + birdBox.height > bottomPipeY) {
            return true;
        }
    }

    return false;
}

// 게임 업데이트
function update() {
    if (gameState !== 'playing') return;

    // 새 물리
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // 파이프 타이머
    pipeTimer++;
    if (pipeTimer >= pipeInterval) {
        createPipe();
        pipeTimer = 0;
    }

    // 파이프 이동
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // 점수 체크
        if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
            pipes[i].passed = true;
            score++;
        }

        // 화면 밖 파이프 제거
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    // 충돌 체크
    if (checkCollision()) {
        gameState = 'gameover';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
        }
    }
}

// 게임 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        drawStartScreen();
    } else {
        drawBackground();

        // 파이프
        pipes.forEach(drawPipe);

        // 바닥
        drawGround();

        // 새
        drawBird();

        // 점수
        drawScore();

        if (gameState === 'gameover') {
            drawGameOver();
        }
    }
}

// 게임 루프
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 점프
function jump() {
    if (gameState === 'start') {
        gameState = 'playing';
        bird.y = 200;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        pipeTimer = 0;
    } else if (gameState === 'playing') {
        bird.velocity = bird.jump;
    } else if (gameState === 'gameover') {
        gameState = 'start';
        bird.y = 200;
        bird.velocity = 0;
        pipes = [];
        score = 0;
    }
}

// 이벤트 리스너
canvas.addEventListener('click', jump);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
    }
});

// 게임 시작
gameLoop();
