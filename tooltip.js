// tooltip.js
export const tooltipState = {
    visible: false,
    x: 0,
    y: 0,
    data: null
  };
  
  export function showTooltip(data, x, y) {
    tooltipState.visible = true;
    tooltipState.data = data;
    tooltipState.x = x;
    tooltipState.y = y;
  }
  
  export function hideTooltip() {
    tooltipState.visible = false;
    tooltipState.data = null;
  }
  