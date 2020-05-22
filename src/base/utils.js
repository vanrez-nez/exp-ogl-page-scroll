
export async function loadTexture(texture, url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      texture.image = img;
      resolve(texture);
    }
  });
}