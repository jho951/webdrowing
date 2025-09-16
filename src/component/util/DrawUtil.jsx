const drawUtils = (ctx) => {
  return {
    clear: (x = 0, y = 0, w = ctx.canvas.width, h = ctx.canvas.height) => {
      ctx.clearRect(x, y, w, h);
    },

    rect: ({ x, y, width, height, fillStyle, strokeStyle, clear = false }) => {
      if (clear) {
        ctx.clearRect(x, y, width, height);
        return;
      }
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, width, height);
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(x, y, width, height);
      }
    },

    circle: ({ x, y, radius, fillStyle, strokeStyle }) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
      }
    },

    line: ({ x1, y1, x2, y2, strokeStyle, lineWidth = 1 }) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    },
  };
};

export default drawUtils;
