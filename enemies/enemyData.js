export const enemiesData = {
    enemy1: {
      name: "Mr. Krabs",
      types: ["basic"],
      maxHp: 100, //LOCKED(v0.1.65)
      speed: 0.53, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy1.png",
      isFlying: false,
      sizeMultiplier: 0.55,
    },
    enemy2: {
      name: "Shpider",
      types: ["basic"],
      maxHp: 120, //LOCKED(v0.1.65)
      speed: 0.38, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy2.png",
      isFlying: false,
      sizeMultiplier: 0.55,
    },
    enemy3: {
        name: "Robot Shpider",
        types: ["basic"],
        maxHp: 135, //LOCKED(v0.1.65)
        speed: 0.51, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy3.png",
        isFlying: false,
        sizeMultiplier: 0.57,
    },
    enemy4: {
        name: "Krustacean",
        types: ["basic"],
        maxHp: 175, //LOCKED(v0.1.65)
        speed: 0.57, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy4.png",
        isFlying: false,
        sizeMultiplier: 0.55,
    },
    enemy5: {
        name: "Vagrant Dead",
        types: ["basic"],
        maxHp: 201, //LOCKED(v0.1.65)
        speed: 0.58, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy5.png",
        isFlying: false,
        sizeMultiplier: 0.71,
    },
    enemy6: {
      name: "Charles Barkley Dead",
      types: ["basic"],
      maxHp: 243, //LOCKED(v0.1.65)
      speed: 0.61, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy6.png",
      isFlying: false,
      sizeMultiplier: 0.71,
    },
    enemy7: {
      name: "El Diablin",
      types: ["basic"],
      maxHp: 285, //LOCKED(v0.1.65)
      speed: 0.69, //LOCKED(v0.1.65)
      reward: 2,
      image: "assets/enemies/enemy7.png",
      isFlying: false,
      sizeMultiplier: 0.71,
    },
    enemy8: {
      name: "Mini-Van Falcon",
      types: ["speed"],
      maxHp: 250, //LOCKED(v0.1.65)
      speed: 1.43, //LOCKED(v0.1.65)
      reward: 2,
      image: "assets/enemies/enemy8.png",
      isFlying: false,
      sizeMultiplier: 0.73,
    },
    enemy9: {
      name: "Lil Chickn-Hed",
      types: ["bonus"],
      maxHp: 745, //LOCKED(v0.1.65)
      speed: 0.88,  //LOCKED(v0.1.65)
      reward: 9,
      image: "assets/enemies/enemy9.png",
      isFlying: false,
      sizeMultiplier: 0.6,
    },
    enemy10: {
      name: "Russell ScareCrowe",
      types: ["boss"],
      maxHp: 3108, //LOCKED(v0.1.65)
      speed: 0.82,  //LOCKED(v0.1.65)
      reward: 22,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy10.png",
      isFlying: false,
      sizeMultiplier: 1.34,
    },
    enemy11: {
      name: "Frank-The-Tank",
      types: ["armored"],
      maxHp: 347, //LOCKED(v0.1.72)
      armor: 303, //LOCKED(v0.1.72)
      speed: 0.84, //LOCKED(v0.1.72)
      reward: 3,
      image: "assets/enemies/enemy11.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy12: {
      name: "Voodoo Goblin",
      types: ["basic"],
      maxHp: 658, //LOCKED(v0.1.72)
      speed: 0.85, //LOCKED(v0.1.72)
      reward: 3,
      image: "assets/enemies/enemy12.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy13: {
      name: "Ghost Wolf",
      types: ["immune"],
      maxHp: 470, //LOCKED(v0.1.73)
      speed: 1.31, //LOCKED(v0.1.73)
      reward: 4,
      image: "assets/enemies/enemy13.png",
      isFlying: false,
      sizeMultiplier: 0.93,

      immunities: ["frost", "acid"]
    },
    enemy14: {
      name: "Fly Boi",
      types: ["air"],
      maxHp: 459, //LOCKED(v0.1.73)
      speed: 1.08, //LOCKED(v0.1.73)
      reward: 5,
      image: "assets/enemies/enemy14.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy15: {
      name: "Old Wise Goblin",
      types: ["invisible"],
      maxHp: 616, //LOCKED(v0.1.73)
      speed: 1.13, //LOCKED(v0.1.73)
      reward: 5,
      image: "assets/enemies/enemy15.png",
      isFlying: false,
      isInvisible: true,
      isRevealed: false,
      sizeMultiplier: 0.93,
    },
    enemy16: {
      name: "Speedy Boi",
      types: ["speed"],
      maxHp: 543, //LOCKED(v0.1.73)
      speed: 1.88, //LOCKED(v0.1.73)
      reward: 6,
      image: "assets/enemies/enemy16.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy17: {
      name: "Flying Claw Machine",
      types: ["air"],
      maxHp: 571, //LOCKED(v0.1.73)
      speed: 1.19, //LOCKED(v0.1.73)
      reward: 6,
      image: "assets/enemies/enemy17.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy18: {
      name: "Frosty",
      types: ["bonus"],
      maxHp: 1167, //LOCKED(v0.1.74)
      speed: 1.32, //LOCKED(v0.1.74)
      reward: 34,
      image: "assets/enemies/enemy18.png",
      isFlying: false,
      sizeMultiplier: 0.97,
    },
    enemy19: {
      name: "Possessed Caterpie",
      types: ["basic"],
      maxHp: 819, //LOCKED(v0.1.75)
      speed: 1.18, //LOCKED(v0.1.75)
      reward: 8,
      image: "assets/enemies/enemy19.png",
      isFlying: false,
      sizeMultiplier: 0.92,
    },
    enemy20: {
      name: "Protein Wolf",
      types: ["boss"],
      maxHp: 6223, //LOCKED(v0.1.74)
      speed: 1.32, //LOCKED(v0.1.74)
      reward: 330,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy20.png",
      isFlying: false,
      sizeMultiplier: 1.31,
    },
    enemy21: {
      name: "Drone",
      types: ["air"],
      maxHp: 750, //LOCKED(v0.1.74)
      speed: 1.17, //LOCKED(v0.1.74)
      reward: 10,
      image: "assets/enemies/enemy21.png",
      isFlying: true,
      sizeMultiplier: 0.91,
    },
    enemy22: {
      name: "Swole Link",
      types: ["armored", "giant"],
      maxHp: 853, //LOCKED(v0.1.74)
      armor: 822, //LOCKED(v0.1.74)
      speed: 0.9, 
      reward: 10,
      image: "assets/enemies/enemy22.png",
      isFlying: false,
      canBeTargetedByAntiAir: true,
      sizeMultiplier: 1.4,
    },
    enemy23: {
      name: "Magic Mike",
      types: ["armored"],
      maxHp: 874, //LOCKED(v0.1.75)
      armor: 1060, //LOCKED(v0.1.75)
      speed: 0.82, 
      reward: 11,
      image: "assets/enemies/enemy23.png",
      isFlying: false,
      sizeMultiplier: 1.1,
    },
    enemy24: {
      name: "Fly Kitty",
      types: ["air", "speed"],
      maxHp: 652, //LOCKED(v0.1.75)
      speed: 1.83, //LOCKED(v0.1.75)
      reward: 12,
      image: "assets/enemies/enemy24.png",
      isFlying: true,
      sizeMultiplier: 0.9,
    },
    enemy25: {
      name: "Splooge",
      types: ["basic"],
      maxHp: 1690, //LOCKED(v0.1.75)
      speed: 0.88, //LOCKED(v0.1.75)
      reward: 13,
      image: "assets/enemies/enemy25.png",
      isFlying: false,
      sizeMultiplier: 0.94,
    },
    enemy26: {
      name: "Top Cat",
      types: ["air", "immune"],
      maxHp: 950, //LOCKED(v0.1.75)
      speed: 1.39, //LOCKED(v0.1.75)
      reward: 13,
      image: "assets/enemies/enemy26.png",
      isFlying: true,
      sizeMultiplier: 0.9,

      immunities: ["frost", "acid"]
    },
    enemy27: {
      name: "Quack",
      types: ["bonus"],
      maxHp: 2266, 
      speed: 1.3, 
      reward: 76,
      image: "assets/enemies/enemy27.png",
      isFlying: false,
      sizeMultiplier: 0.97,
    },
    enemy28: {
      name: "Whiskers",
      types: ["air"],
      maxHp: 841, 
      speed: 1.31, 
      reward: 17,
      image: "assets/enemies/enemy28.png",
      isFlying: true,
      sizeMultiplier: 0.89,
    },
    enemy29: {
      name: "BigBoi Gimli",
      types: ["giant"],
      maxHp: 2880, 
      speed: 0.87, 
      reward: 18,
      image: "assets/enemies/enemy29.png",
      isFlying: false,
      canBeTargetedByAntiAir: true,
      sizeMultiplier: 1.43,
    },
    enemy30: {
      name: "Scary Mean Boi",
      types: ["boss", "invisible"],
      maxHp: 14530, 
      speed: 1.44, 
      reward: 743,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy30.png",
      isFlying: false,
      sizeMultiplier: 1.38,
    },

  };
  