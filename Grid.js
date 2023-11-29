import { GridObject } from "./GridObject.js"
import { ItemObject } from "./ItemObject.js"
import { EnemyObject } from "./EnemyObject.js"
import { promptPlayerForDirection } from "./playerPrompts.js"
import { Player } from "./Player.js"

class Grid {
  #currentObject

  // constructor because we're creating a class
  constructor(width, height, playerStartX = 0, playerStartY = height - 1) {
    this.width = width
    this.height = height
    this.playerX = playerStartX
    this.playerY = playerStartY
    this.player = new Player("Althea", { attack: 10, defense: 5, hp: 20 })

    // create the grid
    this.grid = []
    // want to create 2D array
    for (let row = 0; row < height; row++) {
      let thisRow = []
      for (let col = 0; col < width; col++) {
        thisRow.push(new GridObject())
      }
      this.grid.push(thisRow)
    }

    // player sprite - bottom left of grid
    this.grid[height - 1][0] = new GridObject("🦄", "player")

    // goal sprite - top right of grid
    this.grid[0][width - 1] = new GridObject("🌈", "goal")

    this.startGame()
  }

  async startGame() {
    while (this.player.getStats().hp > 0) {
      this.displayGrid()
      const response = await promptPlayerForDirection()

      switch (response) {
        case "Up": {
          this.movePlayerUp()
          break
        }
        case "Down": {
          this.movePlayerDown()
          break
        }
        case "Left": {
          this.movePlayerLeft()
          break
        }
        case "Right": {
          this.movePlayerRight()
          break
        }
      }
      console.log("--------------------------------")
    }
  }

  // display grid without commas, brackets, etc
  displayGrid() {
    this.player.describe()
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // console.log(this.grid[row][col])
        process.stdout.write(this.grid[row][col].sprite)
        process.stdout.write("\t")
      }
      process.stdout.write("\n")
    }
  }

  generateGridObject() {
    const random = Math.random()
    let object
    // how often do enemies spawn, how often do items spawn?
    if (random < 0.15) {
      object = new ItemObject("🗡️", {
        name: "Sword",
        attack: 3,
        defense: 1,
        hp: 0,
      })
    } else if (random < 0.35) {
      object = new EnemyObject("🕷️", {
        name: "Spider",
        attack: 10,
        defense: 1,
        hp: 6,
      })
    } else {
      object = new GridObject("✨", "discovered")
    }

    return object
  }

  // runs every single time player moves to a new spot
  executeTurn() {
    if (this.grid[this.playerY][this.playerX].type === "goal") {
      console.log(`⭐️ You made it out of the forest! ⭐️`)
      process.exit() // exit program
    }

    if (this.#currentObject.type === "discovered") {
      this.#currentObject.describe()
      return
    }

    if (this.#currentObject.type === "item") {
      this.#currentObject.describe()
      const itemStats = this.#currentObject.getStats()
      this.player.addToStats(itemStats)
      return
    }

    // enemy
    this.#currentObject.describe()

    const enemyStats = this.#currentObject.getStats()
    const enemyName = this.#currentObject.getName()
    const playerStats = this.player.getStats()

    // console.log(enemyStats)
    // console.log(playerStats)

    if (enemyStats.defense > playerStats.attack) {
      console.log(`You lose - ${enemyName} was too powerful!`)
      process.exit()
    }

    let totalPlayerDamage = 0
    while (enemyStats.hp > 0) {
      const enemyDamageTurn = playerStats.attack - enemyStats.defense
      const playerDamageTurn = enemyStats.attack - playerStats.defense

      if (enemyDamageTurn > 0) {
        enemyStats.hp -= enemyDamageTurn
      }
      if (playerDamageTurn > 0) {
        playerStats.hp -= playerDamageTurn
        totalPlayerDamage += playerDamageTurn
      }
    }

    if (playerStats.hp <= 0) {
      console.log(`You lose - ${enemyName} was too powerful!`)
      process.exit()
    }

    this.player.addToStats({ hp: -totalPlayerDamage })
    console.log(`You defeated the ${enemyName}! Your updated stats:`)
    this.player.describe()
  }

  movePlayerRight() {
    // checks if player is at right edge of map
    if (this.playerX === this.width - 1) {
      console.log("Cannot move right")
      return
    }

    // set current spot to discovered
    this.grid[this.playerY][this.playerX] = new GridObject("✨", "discovered")
    // move player to the right
    this.playerX += 1

    // check if target spot has been discovered already
    if (this.grid[this.playerY][this.playerX].type === "discovered") {
      this.grid[this.playerY][this.playerX].describe()
      this.grid[this.playerY][this.playerX] = new GridObject("🦄")
      return
    }

    // discovering new spot
    this.#currentObject = this.generateGridObject() // generation
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🦄")
  }

  movePlayerLeft() {
    // checks if player is at left edge of map
    if (this.playerX === 0) {
      console.log("Cannot move left")
      return
    }

    // set current spot to discovered
    this.grid[this.playerY][this.playerX] = new GridObject("✨", "discovered")
    // move player to the left
    this.playerX -= 1

    // check if target spot has been discovered already
    if (this.grid[this.playerY][this.playerX].type === "discovered") {
      this.grid[this.playerY][this.playerX].describe()

      this.grid[this.playerY][this.playerX] = new GridObject("🦄")
      return
    }

    // discovering new spot
    this.#currentObject = this.generateGridObject() // generation
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🦄")
  }

  movePlayerUp() {
    // checks if player is at top edge of map
    if (this.playerY === 0) {
      console.log("Cannot move up")
      return
    }

    // set current spot to discovered
    this.grid[this.playerY][this.playerX] = new GridObject("✨", "discovered")
    // move player to the left
    this.playerY -= 1

    // check if target spot has been discovered already
    if (this.grid[this.playerY][this.playerX].type === "discovered") {
      this.grid[this.playerY][this.playerX].describe()

      this.grid[this.playerY][this.playerX] = new GridObject("🦄")
      return
    }

    // discovering new spot
    this.#currentObject = this.generateGridObject() // generation
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🦄")
  }
  movePlayerDown() {
    // checks if player is at bottom edge of map
    if (this.playerY === this.height - 1) {
      console.log("Cannot move down")
      return
    }

    // set current spot to discovered
    this.grid[this.playerY][this.playerX] = new GridObject("✨", "discovered")
    // move player to the left
    this.playerY += 1

    // check if target spot has been discovered already
    if (this.grid[this.playerY][this.playerX].type === "discovered") {
      this.grid[this.playerY][this.playerX].describe()

      this.grid[this.playerY][this.playerX] = new GridObject("🦄")
      return
    }

    // discovering new spot
    this.#currentObject = this.generateGridObject() // generation
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🦄")
  }
}

new Grid(5, 5)
