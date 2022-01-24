/**
 * Modify image on canvas w.r.t to scale, left position and top position
 * @param {*} img
 * @param {*} canvas 
 * @param {*} options
 */
export function renderCanvasImage(img, canvas, { scale, leftPos, topPos }) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  ctx.drawImage(img, 0, 0, width, height, leftPos, topPos, editorCanvas.width * scale , editorCanvas.height * scale);
}