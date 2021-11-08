const loadImageToCav = (canvas: any, imageSrc: string) => {
  const img = canvas.createImage();
  img.src = imageSrc;

  return new Promise(resolve => {
    img.onload = () => {
      resolve(true);
    }
  })
}

module.exports = {
  loadImageToCav
}