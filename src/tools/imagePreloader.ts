export const preload = (imagesArray: string[]) => {
    for (const imageSrc of imagesArray) {
        const image = new Image();
        image.src = imageSrc;
    }
}