window.onload = function() {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    const backgroundUpload = document.getElementById('backgroundUpload');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const increaseSizeBtn = document.getElementById('increaseSizeBtn');
    const decreaseSizeBtn = document.getElementById('decreaseSizeBtn');

    const catImg = new Image();
    catImg.src = 'pls-cat-transparent.png'; // Replace with your transparent cat image URL

    let backgroundImg = new Image();
    let isDraggingCat = false;
    let isResizingCat = false; // Flag for resizing cat image
    let resizeHandleRadius = 10; // Radius of resize handles
    let resizeHandleIndex = -1; // Index of the active resize handle (-1 for none)
    let offsetX, offsetY; // Offset for dragging cat image
    let startX, startY; // Starting position of resize handle
    let startCatX, startCatY, startCatWidth, startCatHeight; // Starting position and size of cat image

    // Initial cat size and position
    let catX = canvas.width / 2 - 172.5; // Adjusted for larger cat image
    let catY = canvas.height / 2 - 172.5; // Adjusted for larger cat image
    let catWidth = 345; // Initial cat image width
    let catHeight = 345; // Initial cat image height

    catImg.onload = () => {
        drawCanvas();
    };

    canvas.addEventListener('mousedown', (e) => {
        if (isOverCat(e.offsetX, e.offsetY)) {
            isDraggingCat = true;
            offsetX = e.offsetX - catX;
            offsetY = e.offsetY - catY;
        } else if (isOverResizeHandle(e.offsetX, e.offsetY) !== -1) {
            isResizingCat = true;
            resizeHandleIndex = isOverResizeHandle(e.offsetX, e.offsetY);
            startX = e.offsetX;
            startY = e.offsetY;
            startCatX = catX;
            startCatY = catY;
            startCatWidth = catWidth;
            startCatHeight = catHeight;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDraggingCat) {
            catX = e.offsetX - offsetX;
            catY = e.offsetY - offsetY;
            drawCanvas();
        } else if (isResizingCat) {
            let mouseX = e.offsetX;
            let mouseY = e.offsetY;
            let deltaX = mouseX - startX;
            let deltaY = mouseY - startY;
            switch (resizeHandleIndex) {
                case 0: // Top-left handle
                    catX = startCatX + deltaX;
                    catY = startCatY + deltaY;
                    catWidth = startCatWidth - deltaX;
                    catHeight = startCatHeight - deltaY;
                    break;
                case 1: // Top-right handle
                    catY = startCatY + deltaY;
                    catWidth = startCatWidth + deltaX;
                    catHeight = startCatHeight - deltaY;
                    break;
                case 2: // Bottom-left handle
                    catX = startCatX + deltaX;
                    catWidth = startCatWidth - deltaX;
                    catHeight = startCatHeight + deltaY;
                    break;
                case 3: // Bottom-right handle
                    catWidth = startCatWidth + deltaX;
                    catHeight = startCatHeight + deltaY;
                    break;
                default:
                    break;
            }
            drawCanvas();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDraggingCat = false;
        isResizingCat = false;
        resizeHandleIndex = -1;
    });

    backgroundUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                backgroundImg.src = event.target.result;
                backgroundImg.onload = () => {
                    drawCanvas();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    resetBtn.addEventListener('click', () => {
        backgroundImg.src = '';
        drawCanvas();
    });

    downloadBtn.addEventListener('click', () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'meme.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    increaseSizeBtn.addEventListener('click', () => {
        catWidth *= 1.15;
        catHeight *= 1.15;
        drawCanvas();
    });

    decreaseSizeBtn.addEventListener('click', () => {
        catWidth *= 0.85;
        catHeight *= 0.85;
        drawCanvas();
    });

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundImg.src) {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(catImg, catX, catY, catWidth, catHeight);

        // Draw resize handles
        drawResizeHandle(catX, catY); // Top-left handle
        drawResizeHandle(catX + catWidth, catY); // Top-right handle
        drawResizeHandle(catX, catY + catHeight); // Bottom-left handle
        drawResizeHandle(catX + catWidth, catY + catHeight); // Bottom-right handle
    }

    function drawResizeHandle(x, y) {
        ctx.fillStyle = 'blue'; // Color of resize handles
        ctx.fillRect(x - resizeHandleRadius / 2, y - resizeHandleRadius / 2, resizeHandleRadius, resizeHandleRadius);
    }

    function isOverCat(x, y) {
        return x > catX && x < catX + catWidth && y > catY && y < catY + catHeight;
    }

    function isOverResizeHandle(x, y) {
        if (
            x > catX - resizeHandleRadius / 2 && x < catX + resizeHandleRadius / 2 &&
            y > catY - resizeHandleRadius / 2 && y < catY + resizeHandleRadius / 2
        ) {
            return 0; // Top-left handle
        } else if (
            x > catX + catWidth - resizeHandleRadius / 2 && x < catX + catWidth + resizeHandleRadius / 2 &&
            y > catY - resizeHandleRadius / 2 && y < catY + resizeHandleRadius / 2
        ) {
            return 1; // Top-right handle
        } else if (
            x > catX - resizeHandleRadius / 2 && x < catX + resizeHandleRadius / 2 &&
            y > catY + catHeight - resizeHandleRadius / 2 && y < catY + catHeight + resizeHandleRadius / 2
        ) {
            return 2; // Bottom-left handle
        } else if (
            x > catX + catWidth - resizeHandleRadius / 2 && x < catX + catWidth + resizeHandleRadius / 2 &&
            y > catY + catHeight - resizeHandleRadius / 2 && y < catY + catHeight + resizeHandleRadius / 2
        ) {
            return 3; // Bottom-right handle
        }
        return -1;
    }
};
