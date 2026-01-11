const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const mouse = {
  x: 0,
  y: 0
};

export { canvas, ctx, mouse };