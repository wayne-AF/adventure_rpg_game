class GridObject {
  #backgroundSprites = ["🌳", "🌲", "🪵", "🌴", "🪨"]

  //   randomly assigning a background sprite to a space
  //   if sprite has not been provided
  constructor(sprite, type = "background") {
    if (!sprite) {
      const randomIndex = Math.floor(
        Math.random() * this.#backgroundSprites.length
      )
      this.sprite = this.#backgroundSprites[randomIndex]
    } else {
      this.sprite = sprite
    }
    this.type = type
  }

  describe() {
    const random = Math.random()
    if (random < 0.33) {
      console.log("Nothing found")
    } else if (random < 0.66) {
      console.log("Coast is clear")
    } else {
      console.log("The forest is quiet")
    }
  }
}

export { GridObject }
