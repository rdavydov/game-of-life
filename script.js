// Переменные для управления игрой
let gridSize = 70; // Размер поля по умолчанию
let intervalId; // Идентификатор интервала для автоматической генерации следующего поколения
let generationCount = 0; // Счетчик поколений
let cellColor = '#3498db'; // Цвет живых клеток
let gridColor = '#000000'; // Цвет сетки
let bgColor = '#f5f5f5'; // Цвет фона

let cells = []; // Массив для хранения состояния клеток

// Инициализация игры при загрузке страницы
function initializeGame() {
    gridSize = parseInt(document.getElementById('size').value); // Получаем размер поля из элемента ввода
    generationCount = 0;

    clearInterval(intervalId); // Останавливаем текущий процесс эволюции
    document.getElementById('generation').innerText = 'Поколение: 0';

    cellColor = document.getElementById('cell-color').value; // Получаем цвет клеток из элемента ввода
    gridColor = document.getElementById('grid-color').value; // Получаем цвет сетки из элемента ввода
    bgColor = document.getElementById('bg-color').value; // Получаем цвет фона из элемента ввода

    document.body.style.backgroundColor = bgColor; // Устанавливаем цвет фона страницы

    createGrid(); // Создаем игровое поле

    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
}

// Запуск и остановка эволюции
function toggleGame() {
    if (intervalId) {
        clearInterval(intervalId); // Если эволюция запущена, останавливаем
        intervalId = null;
    } else {
        intervalId = setInterval(generateNextGeneration, 200); // Иначе запускаем с интервалом 200 миллисекунд
    }
}

// Создание игрового поля
function createGrid() {
    const canvas = document.getElementById('grid-canvas'); // Получаем элемент canvas
    const ctx = canvas.getContext('2d'); // Получаем контекст рисования

    canvas.width = window.innerWidth * 0.95; // Устанавливаем ширину canvas как 95% ширины окна
    canvas.height = window.innerHeight * 0.75; // Устанавливаем высоту canvas как 75% высоты окна

    ctx.strokeStyle = gridColor; // Устанавливаем цвет сетки

    // Инициализируем массив клеток случайными значениями
    cells = Array.from({ length: gridSize * gridSize }, () => Math.random() < 0.2);

    drawCells(); // Рисуем начальное состояние клеток
}

// Обработчик клика по canvas
function toggleCell(event) {
    const canvas = document.getElementById('grid-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - 10) / ((canvas.width - 20) / gridSize));
    const y = Math.floor((event.clientY - rect.top - 10) / ((canvas.height - 20) / gridSize));

    const index = y * gridSize + x;
    cells[index] = !cells[index]; // Инвертируем состояние клетки (живая/мертвая)

    drawCells(); // Рисуем измененное состояние клеток
}

// Рисование клеток на canvas
function drawCells() {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas

    // Рисуем вертикальные и горизонтальные линии сетки
    for (let i = 0; i <= gridSize; i++) {
        const x = 10 + (i / gridSize) * (canvas.width - 20);
        const y = 10 + (i / gridSize) * (canvas.height - 20);

        ctx.beginPath();
        ctx.moveTo(x, 10);
        ctx.lineTo(x, canvas.height - 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(canvas.width - 10, y);
        ctx.stroke();
    }

    const cellSizeW = (canvas.width - 20) / gridSize;
    const cellSizeH = (canvas.height - 20) / gridSize;

    // Рисуем клетки в соответствии с их состоянием
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            if (cells[index]) {
                ctx.fillStyle = cellColor; // Заливаем цветом клетки
                ctx.fillRect(10 + j * cellSizeW, 10 + i * cellSizeH, cellSizeW, cellSizeH);
                // ctx.strokeRect(10 + j * cellSizeW, 10 + i * cellSizeH, cellSizeW, cellSizeH); // Рисуем границы клеток
            }
        }
    }
}

// Генерация следующего поколения
function generateNextGeneration() {
    const nextGenerationState = [];

    // Логика эволюции для каждой клетки
    for (let i = 0; i < cells.length; i++) {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);
        const neighbors = countNeighbors(x, y);

        let nextCellState = cells[i];

        if (cells[i]) {
            if (neighbors < 2 || neighbors > 3) {
                nextCellState = false; // Умирание от одиночества или перенаселения
            }
        } else {
            if (neighbors === 3) {
                nextCellState = true; // Рождение новой клетки
            }
        }

        nextGenerationState.push(nextCellState);
    }

    cells = nextGenerationState; // Обновляем состояние клеток

    generationCount++;
    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
    drawCells(); // Рисуем измененное состояние клеток
}

// Подсчет количества живых соседей для клетки
function countNeighbors(x, y) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const neighborX = (x + i + gridSize) % gridSize;
            const neighborY = (y + j + gridSize) % gridSize;
            const neighborIndex = neighborY * gridSize + neighborX;

            if (cells[neighborIndex] && !(i === 0 && j === 0)) {
                count++; // Увеличиваем счетчик для каждой живой соседней клетки
            }
        }
    }

    return count;
}

// Инициализация игры при загрузке страницы
initializeGame();

// Добавляем обработчик клика по canvas
document.getElementById('grid-canvas').addEventListener('click', toggleCell);

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', () => {
    // При изменении размера окна пересчитываем размеры canvas и перерисовываем клетки
    const canvas = document.getElementById('grid-canvas'); // Получаем элемент canvas

    canvas.width = window.innerWidth * 0.95; // Устанавливаем ширину canvas как 95% ширины окна
    canvas.height = window.innerHeight * 0.75; // Устанавливаем высоту canvas как 75% высоты окна
    drawCells();
});
