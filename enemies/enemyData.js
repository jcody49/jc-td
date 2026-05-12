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
      maxHp: 750, 
      speed: 0.88,
      reward: 9,
      image: "assets/enemies/enemy9.png",
      isFlying: false,
      sizeMultiplier: 0.6,
    },
    enemy10: {
      name: "Russell ScareCrowe",
      type: "boss",
      maxHp: 3100, 
      speed: 0.82,
      reward: 22,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy10.png",
      isFlying: false,
      sizeMultiplier: 1.34,
    },
    enemy11: {
      name: "Frank-The-Tank",
      type: "basic",
      maxHp: 320, 
      armor: 240,
      speed: 0.77, 
      reward: 3,
      image: "assets/enemies/enemy11.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy12: {
      name: "Voodoo Goblin",
      type: "basic",
      maxHp: 455, //LOCKED(v0.1.65)
      speed: 0.81, //LOCKED(v0.1.65)
      reward: 3,
      image: "assets/enemies/enemy12.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy13: {
      name: "Ghost Wolf",
      type: "immune",
      maxHp: 466, 
      speed: 1.31, 
      reward: 4,
      image: "assets/enemies/enemy13.png",
      isFlying: false,
      sizeMultiplier: 0.93,

      immunities: ["frost", "acid"]
    },
    enemy14: {
      name: "Fly Boi",
      type: "air",
      maxHp: 470, 
      speed: 1.11, 
      reward: 5,
      image: "assets/enemies/enemy14.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy15: {
      name: "Old Wise Goblin",
      type: "basic",
      maxHp: 490, 
      speed: 1.13, 
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
      maxHp: 520, 
      speed: 1.84, 
      reward: 6,
      image: "assets/enemies/enemy16.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy17: {
      name: "Flying Claw Machine",
      type: "air",
      maxHp: 555, 
      speed: 1.13, 
      reward: 6,
      image: "assets/enemies/enemy17.png",
      isFlying: true,
      sizeMultiplier: 0.93,
    },
    enemy18: {
      name: "Frosty",
      type: "bonus",
      maxHp: 1260, 
      speed: 1.35, 
      reward: 34,
      image: "assets/enemies/enemy18.png",
      isFlying: false,
      sizeMultiplier: 0.97,
    },
    enemy19: {
      name: "Possessed Caterpie",
      type: "basic",
      maxHp: 610, 
      speed: 1.15, 
      reward: 8,
      image: "assets/enemies/enemy19.png",
      isFlying: false,
      sizeMultiplier: 0.93,
    },
    enemy20: {
      name: "Protein Wolf",
      type: "boss",
      maxHp: 6215, 
      speed: 1.32, 
      reward: 330,
      lifeReward: 1,
      score: 10,
      image: "assets/enemies/enemy20.png",
      isFlying: false,
      sizeMultiplier: 1.31,
    },
    

  };
  