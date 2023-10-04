const Game = (function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  let bubbles = [];
  let round = 1;
  let score = 0;
  let bubblesToPop = 5;
  let bubblesPopped = 0;
  let timeLimit = 10;
  let timeLeft = timeLimit;
  let particles = [];
  let gameInterval;
  let timerInterval;
  let gameStarted = false;
  let startButton = document.getElementById("startButton");
  let bubble = {x: 100, y: 100, radius: 30};
  let touchRadius = 30;
  let shouldMoveBubbles = true;

  window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI*2);
  ctx.fill();
  canvas.addEventListener("click", function(e) {
    if (isPointInBubble(e.clientX, e.clientY, bubble, bubble.radius)) {
    }
  });


  canvas.addEventListener("touchstart", function(e) {

  let touch = e.touches[0];
  if (isPointInBubble(touch.clientX, touch.clientY, bubble, 10)) { 
    console.log("Bubble zerstört!");
  }
});
}

document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
canvas.addEventListener("click", function(e) {
    handleBubbleClick(e);
});


function isPointInBubble(x, y, bubble, touchRadiusFactor = 1) {
  let dx = x - bubble.x;
  let dy = y - bubble.y;
  return dx*dx + dy*dy <= (bubble.radius * touchRadiusFactor)*(bubble.radius * touchRadiusFactor);
}
  const bubbleSound = document.getElementById("bubbleSound");

  function getRandomColor() {
    const colors = [
      "#FF4136",
      "#FF851B",
      "#FFDC00",
      "#2ECC40",
      "#0074D9",
      "#B10DC9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }



 function Bubble(x, y, radius, dx, dy, color, isBonus) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.isBonus = isBonus;
    this.colorChangeCounter = 0;  
}


Bubble.prototype.draw = function () {
    if (this.isBonus) {
        this.colorChangeCounter++;
        if (this.colorChangeCounter >= 15) {
            this.color = getRandomColor();
            this.colorChangeCounter = 0;
        }
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
};



  Bubble.prototype.move = function () {
  this.x += this.dx;
  this.y += this.dy;

  if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
    this.dx = -this.dx;
  }

  if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
    this.dy = -this.dy;
  }
};

function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.radius = 2;
  this.dx = (Math.random() - 0.5) * 2;
  this.dy = (Math.random() - 0.5) * 2;
  this.color = color;
  this.alpha = 1;
  this.fadeOutRate = Math.random() * 0.02;  
}


  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };


  Particle.prototype.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= this.fadeOutRate;

    if (this.alpha <= 0) {
      particles.splice(particles.indexOf(this), 1);
    }

    this.draw();
  };


function createBubbles() {
  bubbles = [];

  for (let i = 0; i < bubblesToPop; i++) {  
    const radius = Math.random() * 45 + 28;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 2;  
    const dy = (Math.random() - 0.5) * 2;  
    const color = getRandomColor();
    bubbles.push(new Bubble(x, y, radius, dx, dy, color));
  }

  const bonusRadius = Math.random() * 45 + 28;
  const bonusX = Math.random() * (canvas.width - bonusRadius * 2) + bonusRadius;
  const bonusY = Math.random() * (canvas.height - bonusRadius * 2) + bonusRadius;
  const bonusDx = (Math.random() - 0.5) * 2;
  const bonusDy = (Math.random() - 0.5) * 2;
  const bonusColor = "black";
  const bonusBubble = new Bubble(bonusX, bonusY, bonusRadius, bonusDx, bonusDy, bonusColor, true);
  bubbles.push(bonusBubble);

}

function updateTimer() {
  timeLeft--;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    gameOver();
  }

  document.getElementById("timer").innerText = "Time: " + timeLeft;
}


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    if (shouldMoveBubbles || bubble.isBonus) {
      bubble.move();
    }
    bubble.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
}


function endRound() {
  document.getElementById("score").innerText = "Bubbles: " + score;
  startButton.disabled = false;  
  gameStarted = false;  
  startGame();
}


function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.radius = 2;
  
  this.speed = Math.random() * 3 + 1; 
  this.direction = Math.random() * Math.PI * 2; 
  this.dx = Math.cos(this.direction) * this.speed; 
  this.dy = Math.sin(this.direction) * this.speed; 
  this.color = color;
  this.alpha = 1;
  this.fadeOutRate = 0.02;
}


function handleBubbleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i];
      const dx = mouseX - bubble.x;
      const dy = mouseY - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bubble.radius) {
        for (let j = 0; j < 100; j++) {
          const particle = new Particle(bubble.x, bubble.y, bubble.color);
          particle.radius = Math.random() * 3 + 1; 
          const angle = Math.random() * Math.PI * 2; 
          const speed = Math.random() * 3 + 1; 
          const distance = Math.random() * bubble.radius * 0.5; 
          particle.dx = Math.cos(angle) * distance * Math.random() * speed; 
          particle.dy = Math.sin(angle) * distance * Math.random() * speed; 
          particles.push(particle);
        }
        if (bubble.isBonus) {
          shouldMoveBubbles = false;


    setTimeout(() => {
        shouldMoveBubbles = true;
    }, 3000);
}



bubbles.forEach(bubble => {
    if (shouldMoveBubbles || bubble.isBonus) {
        bubble.move();
    }
    bubble.draw();
})

        try {
  bubbleSound.currentTime = 0;
  bubbleSound.play();
} catch (err) {
  console.error('Failed to play the bubble sound:', err);
}

        bubbles.splice(i, 1);
        bubblesPopped++;
        score++;
        document.getElementById("score").innerText =
          "Bubbles: " + score;
        break;
      }
    }

    if (bubbles.length === 0) {
      clearInterval(timerInterval);
      clearInterval(gameInterval);
      endRound();
    }
}


function endRound() {
  round ++;
  startButton.disabled = false; 
  shouldMoveBubbles = true; 
  gameStarted = false; 
  startNewRound();
  setRandomBackgroundImage();
  document.getElementById("rounds").innerText = "Round: " + round;
}


function startNewRound() {
  gameStarted = true;;
  bubblesToPop = round * 4; 
  const calculatedTime = timeLimit + ( round * 2);
  timeLeft = Math.min(calculatedTime, 30);  
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(animate, 1000 / 60);  
  timerInterval = setInterval(updateTimer, 1000);

  createBubbles(); 

  showCanvas();
}

function hideCanvas() {
  canvas.style.display = 'none';
  document.getElementById("menu").style.display = "flex";
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("startButton").style.display = "block";
  
}

function hideCanvasEnd() {
  canvas.style.display = 'none';
  document.getElementById("menu").style.display = "flex";
  document.getElementById("gameOverText").style.display = 'block';
  document.getElementById("gameOver").style.display = "flex";
  document.getElementById("form").style.display = "none";
  document.getElementById("finalScore").style.display = "none";
  setTimeout(() => {
    document.getElementById("gameOverText").style.display = 'none'
  document.getElementById("startButton").style.display = "none";
  document.getElementById("finalScore").style.display = "block";
  document.getElementById("finalScore").textContent = `Score: ${score} `
  document.getElementById("form").style.display = "block";
  },3000);
}

document.getElementById("restartButton").addEventListener("click", function() {
  setRandomBackgroundImage();
  hideCanvas();
});

function showCanvas() {
  canvas.style.display = 'block';
  document.getElementById("menu").style.display = "none";
  

}

function startGame() {
  if (!gameStarted) {
    document.getElementById("startButton").style.display = "none";
    let countdown = 3;  
    const countdownElement = document.getElementById('countdown');

    countdownElement.style.display = 'block';  // Make the countdown visible
    countdownElement.textContent = countdown;  // Display initial countdown value

    const countdownInterval = setInterval(() => {
      countdown--;  // Decrease countdown by 1 every second
      countdownElement.textContent = countdown > 0 ? countdown : 'GO!';  // Display countdown or 'GO!' if countdown is 0

      if (countdown <= 0) {  // If countdown has reached 0
        clearInterval(countdownInterval);  // Stop the countdown

        setTimeout(() => {  // After a brief pause
          countdownElement.style.display = 'none';  // Hide the countdown again
        }, 1000);

        // Delay the start of the game until after the 'GO!' message has been displayed
        setTimeout(() => {
          gameStarted = true;
          round = 1; // Reset the round
          score = 0;  // Reset score
          bubblesToPop = round * 5; // Reset bubblesToPop
          timeLeft = timeLimit;  // Reset the timer

          // Clear existing intervals before setting new ones
          clearInterval(gameInterval);
          clearInterval(timerInterval);

          gameInterval = setInterval(animate, 1000 / 60);  // Frame rate is 60 frames per second
          timerInterval = setInterval(updateTimer, 1000);
          startButton.disabled = true;  // Disable the start button during the game

          createBubbles();  // Create more bubbles

          // Show the canvas
          showCanvas();

          // Update scoreboard
          document.getElementById("score").innerText = "Bubbles: " + score;
          document.getElementById("rounds").innerText = "Round: " + round;
        }, 1000);
      }
    }, 1000);
  }
}






// End the game
function gameOver() {
  gameStarted = false; 
  bubbles = [];  
  particles = [];  
  round = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRandomBackgroundImage();
    hideCanvasEnd();
    // Enable the start button
    startButton.disabled = false;
  };

function setRandomBackgroundImage() {
  let randomNumber = Math.floor(Math.random() * 10) + 1;


  let filePath = "img/level" + randomNumber + ".jpeg";


  document.getElementById("gameCanvas").style.backgroundImage = "url(" + filePath + ")";
  document.getElementById("menu").style.backgroundImage = "url(" + filePath + ")";
}




// Initialize the game
function init() {
  canvas.addEventListener("click", handleBubbleClick);
  startButton.addEventListener("click", startGame);
  document.getElementById("score").textContent = "Bubbles: 0";
  document.getElementById("rounds").innerText = "Round: " + round;
  document.getElementById("timer").innerText = "Time Left: " + timeLeft;
  setRandomBackgroundImage();
  hideCanvas();
}


  // Public API
  return {
    init: init,
  };
})();

// Start the game
Game.init();

document.getElementById("submitForm").addEventListener("submit", function(e) {
  e.preventDefault();  // Prevent the form from submitting normally
  const playerName = document.getElementById("name").value;

  // Extract only the numerical part of the score
  const playerScore = document.getElementById("score").innerText.split(": ")[1]; 

  $.ajax({
      type: "POST",
      url: "database.php",  
      data: {
          name: playerName,
          score: playerScore
      },
      success: function(response) {
          console.log(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
      }
  });

  // Clear the input field
  document.getElementById("name").value = "";

  // Hide the game over screen
  document.getElementById("gameOver").style.display = "none";

  // Show the start button
  startButton.style.display = "block";
});

let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

function resizeCanvas() {
    if (window.matchMedia("(max-width: 700px)").matches) {
        // Wenn die Bildschirmgröße 700px oder weniger beträgt, setze die Breite und Höhe des Canvas entsprechend
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        // Bei Bildschirmgrößen größer als 700px setzen Sie die Breite und Höhe auf feste Werte
        canvas.width = 900;
        canvas.height = 600;
    }
}

window.addEventListener('load', resizeCanvas, false);
window.addEventListener('resize', resizeCanvas, false);

