/**
 * Client-Side Image Optimizer
 * Loads image onto a canvas, resizes it to a maximum bounding box,
 * and compresses it to WebP format to optimize storage and loading speed.
 */
export async function optimizeImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> {
  // If browser doesn't support Canvas/FileReader or it's an SVG/PDF, skip optimization
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dynamic dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw to canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file); // Fallback to raw file if canvas context fails
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP (if supported) or JPEG
        const mimeType = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create a new File from the blob
            const newName = file.name.substring(0, file.name.lastIndexOf(".")) + ".webp";
            const optimizedFile = new File([blob], newName, {
              type: mimeType,
              lastModified: Date.now()
            });

            resolve(optimizedFile);
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
