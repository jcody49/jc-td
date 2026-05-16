export const enemiesData = {
    enemy1: {
      name: "Mr. Krabs",
      type: "basic",
      maxHp: 100, //LOCKED(v0.1.65)
      speed: 0.53, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy1.png",
      isFlying: false,
      sizeMultiplier: 0.55,
    },
    enemy2: {
      name: "Shpider",
      type: "basic",
      maxHp: 120, //LOCKED(v0.1.65)
      speed: 0.38, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy2.png",
      isFlying: false,
      sizeMultiplier: 0.55,
    },
    enemy3: {
        name: "Robot Shpider",
        type: "basic",
        maxHp: 135, //LOCKED(v0.1.65)
        speed: 0.51, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy3.png",
        isFlying: false,
        sizeMultiplier: 0.57,
    },
    enemy4: {
        name: "Krustacean",
        type: "basic",
        maxHp: 175, //LOCKED(v0.1.65)
        speed: 0.57, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy4.png",
        isFlying: false,
        sizeMultiplier: 0.55,
    },
    enemy5: {
        name: "Vagrant Dead",
        type: "basic",
        maxHp: 201, //LOCKED(v0.1.65)
        speed: 0.58, //LOCKED(v0.1.65)
        reward: 1,
        image: "assets/enemies/enemy5.png",
        isFlying: false,
        sizeMultiplier: 0.71,
    },
    enemy6: {
      name: "Charles Barkley Dead",
      type: "basic",
      maxHp: 243, //LOCKED(v0.1.65)
      speed: 0.61, //LOCKED(v0.1.65)
      reward: 1,
      image: "assets/enemies/enemy6.png",
      isFlying: false,
      sizeMultiplier: 0.71,
    },
    enemy7: {
      name: "El Diablin",
      type: "basic",
      maxHp: 285, //LOCKED(v0.1.65)
      speed: 0.69, //LOCKED(v0.1.65)
      reward: 2,
      image: "assets/enemies/enemy7.png",
      isFlying: false,
      sizeMultiplier: 0.71,
    },
    enemy8: {
      name: "Mini-Van Falcon",
      type: "speed",
      maxHp: 250, //LOCKED(v0.1.65)
      speed: 1.43, //LOCKED(v0.1.65)
      reward: 2,
      image: "assets/enemies/enemy8.png",
      isFlying: false,
      sizeMultiplier: 0.73,
    },
    enemy9: {
      name: "Lil Chickn-Hed",
      type: "bonus",
      maxHp: 745, //LOCKED(v0.1.65)
      speed: 0.88,  //LOCKED(v0.1.65)
      reward: 9,
      image: "assets/enemies/enemy9.png",
      isFlying: false,
      sizeMultiplier: 0.6,
    },
    enemy10: {
      name: "Russell ScareCrowe",
      type: "boss",
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
      type: "armored",
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
      type: "basic",
      maxHp: 658, //LOCKED(v0.1.72)
      speed: 0.85, //LOCKED(v0.1.72)
      reward: 3,
      image: "assets/enemies/enemy12.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy13: {
      name: "Ghost Wolf",
      type: "immune",
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
      type: "air",
      maxHp: 459, //LOCKED(v0.1.73)
      speed: 1.08, //LOCKED(v0.1.73)
      reward: 5,
      image: "assets/enemies/enemy14.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy15: {
      name: "Old Wise Goblin",
      type: "invisible",
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
      type: "speed",
      maxHp: 543, 
      speed: 1.88, 
      reward: 6,
      image: "assets/enemies/enemy16.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy17: {
      name: "Flying Claw Machine",
      type: "air",
      maxHp: 572, 
      speed: 1.2, 
      reward: 6,
      image: "assets/enemies/enemy17.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy18: {
      name: "Frosty",
      type: "bonus",
      maxHp: 1197, //LOCKED(v0.1.73)
      speed: 1.35, //LOCKED(v0.1.73)
      reward: 34,
      image: "assets/enemies/enemy18.png",
      isFlying: false,
      sizeMultiplier: 0.97,
    },
    enemy19: {
      name: "Possessed Caterpie",
      type: "basic",
      maxHp: 689, 
      speed: 1.18, 
      reward: 8,
      image: "assets/enemies/enemy19.png",
      isFlying: false,
      sizeMultiplier: 0.92,
    },
    enemy20: {
      name: "Protein Wolf",
      type: "boss",
      maxHp: 6223, 
      speed: 1.32, 
      reward: 330,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy20.png",
      isFlying: false,
      sizeMultiplier: 1.31,
    },
    enemy21: {
      name: "Drone",
      type: "air",
      maxHp: 650, 
      speed: 1.16, 
      reward: 10,
      image: "assets/enemies/enemy21.png",
      isFlying: true,
      sizeMultiplier: 0.91,
    },
    enemy22: {
      name: "Swole Link",
      types: ["armored", "giant"],
      maxHp: 600, 
      armor: 531, 
      speed: 0.86, 
      reward: 10,
      image: "assets/enemies/enemy22.png",
      isFlying: false,
      canBeTargetedByAntiAir: true,
      sizeMultiplier: 1.4,
    },
    enemy23: {
      name: "Magic Mike",
      type: "armored",
      maxHp: 719, 
      armor: 668, 
      speed: 0.85, 
      reward: 11,
      image: "assets/enemies/enemy23.png",
      isFlying: false,
      sizeMultiplier: 1.1,
    },
    enemy24: {
      name: "Fly Kitty",
      type: "air, speed",
      maxHp: 660, 
      speed: 1.9, 
      reward: 12,
      image: "assets/enemies/enemy24.png",
      isFlying: true,
      sizeMultiplier: 0.9,
    },
    enemy25: {
      name: "Splooge",
      type: "basic",
      maxHp: 875, 
      speed: 0.86, 
      reward: 13,
      image: "assets/enemies/enemy25.png",
      isFlying: false,
      sizeMultiplier: 0.94,
    },
    enemy26: {
      name: "Top Cat",
      type: "air, immune",
      maxHp: 700, 
      speed: 1.35, 
      reward: 13,
      image: "assets/enemies/enemy26.png",
      isFlying: true,
      sizeMultiplier: 0.9,
    },
    enemy27: {
      name: "Quack",
      type: "bonus",
      maxHp: 2270, 
      speed: 1.3, 
      reward: 76,
      image: "assets/enemies/enemy27.png",
      isFlying: false,
      sizeMultiplier: 0.97,
    },
    enemy28: {
      name: "Whiskers",
      type: "air",
      maxHp: 750, 
      speed: 1.31, 
      reward: 17,
      image: "assets/enemies/enemy28.png",
      isFlying: true,
      sizeMultiplier: 0.89,
    },
    enemy29: {
      name: "BigBoi Gimli",
      type: "giant",
      maxHp: 960, 
      speed: 0.84, 
      reward: 18,
      image: "assets/enemies/enemy29.png",
      isFlying: false,
      canBeTargetedByAntiAir: true,
      sizeMultiplier: 1.43,
    },
    enemy30: {
      name: "Scary Mean Boi",
      type: "boss",
      maxHp: 12215, 
      speed: 1.35, 
      reward: 743,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy30.png",
      isFlying: false,
      sizeMultiplier: 1.38,
    },

  };
  