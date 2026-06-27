let moleTile;
let bombTiles = [];
let score = 0;
let gameOver = false;
const startButton = document.getElementById('startButton');
const tryAgain = document.getElementById('tryagain');

startButton.addEventListener('click', function() {
  score = 0;
  gameOver = false;
  bombTiles = [];
  document.getElementById('score').innerText = score;
  document.getElementById('board').innerHTML = '';
  setGame();
  startButton.style.visibility = "hidden";
  tryAgain.style.visibility = "hidden";
});

function setGame() {
  for(let i = 0; i < 9; i++) {
    let tile = document.createElement("div")
    tile.id = i.toString()
    // tile.addEventListener("click"; selectTile())
    let board = document.getElementById("board")
    let pipe = document.createElement("img")
    pipe.src = "./hole.png"
    pipe.classList.add("pipe")
    board.appendChild(tile)
    tile.appendChild(pipe)
  }

  let moleDelay = 3000
  let bombDelay = 6000
  const minDelay = 800

  function scheduleMole() {
    if (gameOver) return
    setMole()
    moleDelay = Math.max(minDelay, moleDelay - 100)
    setTimeout(scheduleMole, moleDelay)
  }

  function scheduleBomb() {
    if (gameOver) return
    setBomb()
    bombDelay = Math.max(minDelay, bombDelay - 200)
    setTimeout(scheduleBomb, bombDelay)
  }

  setTimeout(scheduleMole, moleDelay)
  setTimeout(scheduleBomb, bombDelay)
}

function getRandomTile() {
  return Math.floor(Math.random()*9).toString()
}

function setMole() {
  if (moleTile) {
    const oldMole = moleTile.querySelector(".mole")
    if (oldMole) oldMole.remove()
  }

  const moleImage = document.createElement("img")
  moleImage.src = "./tomato.png"
  moleImage.classList.add("mole")

  moleImage.addEventListener("click", (e) => {
    if (gameOver) return

    score += 1
    document.getElementById("score").innerText = score
    moleImage.style.pointerEvents = "none"
    e.stopPropagation()
  })

  let num;
  do {
    num = getRandomTile()
  } while (bombTiles.some(t => t.id == num))

  moleTile = document.getElementById(num)
  moleTile.appendChild(moleImage)

  setTimeout(() => {
    moleImage.classList.add("up")
  }, 50)

  repositionBombs()
}

function repositionBombs() {
  const count = bombTiles.length
  bombTiles.forEach(tile => {
    const old = tile.querySelector(".bomb")
    if (old) old.remove()
  })
  bombTiles = []

  for (let i = 0; i < count; i++) {
    const bombImage = document.createElement("img")
    bombImage.src = "./bug.png"
    bombImage.classList.add("bomb")

    bombImage.addEventListener("click", (e) => {
      if (gameOver) return

      gameOver = true
      document.getElementById("score").innerText = "Game over! Collected Tomatoes: " + score + " — Press Start to try again."
      startButton.style.visibility = "visible"
      e.stopPropagation()
    })

    let num;
    do {
      num = getRandomTile()
    } while ((moleTile && moleTile.id == num) || bombTiles.some(t => t.id == num))

    const newBombTile = document.getElementById(num)
    newBombTile.appendChild(bombImage)
    bombTiles.push(newBombTile)

    setTimeout(() => {
      bombImage.classList.add("upp")
    }, 50)
  }
}

function setBomb() {
  if (bombTiles.length >= 3) {
    const oldest = bombTiles.shift()
    const oldBomb = oldest.querySelector(".bomb")
    if (oldBomb) oldBomb.remove()
  }

  const bombImage = document.createElement("img")
  bombImage.src = "./bug.png"
  bombImage.classList.add("bomb")

  bombImage.addEventListener("click", (e) => {
    if (gameOver) return

    gameOver = true
    document.getElementById("score").innerText = "Game over! Collected Tomatoes: " + score
    tryAgain.innerText = "Press Start to try again."
    startButton.style.visibility = "visible"
    tryAgain.style.visibility = "visible"
    e.stopPropagation()
  })

  let num;
  do {
    num = getRandomTile()
  } while ((moleTile && moleTile.id == num) || bombTiles.some(t => t.id == num))

  const newBombTile = document.getElementById(num)
  newBombTile.appendChild(bombImage)
  bombTiles.push(newBombTile)

  setTimeout(() => {
    bombImage.classList.add("upp")
  }, 50)
}