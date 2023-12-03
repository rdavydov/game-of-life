// Переменные для управления игрой
let gridSize = 70; // Размер поля по умолчанию
let intervalId; // Идентификатор интервала для автоматической генерации следующего поколения
let generationCount = 0; // Счетчик поколений
let cellColor = '#3498db';
let gridColor = '#000000';
let bgColor = '#f5f5f5';

// Инициализация игры при загрузке страницы
function initializeGame() {
    // Получение размера поля из поля ввода
    gridSize = parseInt(document.getElementById('size').value);
    generationCount = 0;

    // Остановка текущего процесса эволюции
    clearInterval(intervalId);
    document.getElementById('generation').innerText = 'Поколение: 0';

    // Получение выбранных цветов из контролов
    cellColor = document.getElementById('cell-color').value;
    gridColor = document.getElementById('grid-color').value;
    bgColor = document.getElementById('bg-color').value;

    // Установка цвета фона страницы
    document.body.style.backgroundColor = bgColor;

    // Создание и инициализация игрового поля
    createGrid();
    initializeGrid();

    // Обновление отображения текущего поколения на странице
    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
}

// Запуск и остановка эволюции
function toggleGame() {
    // Если эволюция запущена, то останавливаем, иначе запускаем
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    } else {
        intervalId = setInterval(generateNextGeneration, 100);
    }
}

// Генерация следующего поколения
function generateNextGeneration() {
    // Создаем новый массив для хранения состояния следующего поколения
    const nextGenerationState = [];

    // Получаем все клетки текущего поколения
    const cells = document.getElementsByClassName('cell');

    // Цикл по всем клеткам текущего поколения
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = i % gridSize; // Получение координаты по горизонтали
        const y = Math.floor(i / gridSize); // Получение координаты по вертикали
        const neighbors = countNeighbors(x, y); // Подсчет соседей для текущей клетки

        // Определяем состояние клетки в следующем поколении
        let nextCellState = cell.classList.contains('active'); // По умолчанию остается такой же

        // Логика игры "Жизнь"
        if (cell.classList.contains('active')) { // Если клетка активна
            if (neighbors < 2 || neighbors > 3) {
                // Если соседей меньше 2 или больше 3, клетка умирает
                nextCellState = false;
            }
        } else {
            if (neighbors === 3) {
                // Если ровно 3 соседа, клетка становится активной
                nextCellState = true;
            }
        }

        // Добавляем состояние клетки в массив для следующего поколения
        nextGenerationState.push(nextCellState);
    }

    // Применяем состояние следующего поколения к клеткам
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const nextCellState = nextGenerationState[i];

        // Устанавливаем или убираем активное состояние в зависимости от следующего поколения
        if (nextCellState) {
            cell.classList.add('active');
            cell.style.backgroundColor = cellColor; // Устанавливаем цвет клетки
        } else {
            cell.classList.remove('active');
            cell.style.backgroundColor = ''; // Убираем цвет клетки
        }
    }

    // Увеличиваем счетчик поколений
    generationCount++;
    
    // Обновляем отображение текущего поколения на странице
    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
}

// Создание игрового поля с учетом выбора цвета грида
function createGrid() {
    // Получение контейнера для игрового поля
    const gameContainer = document.getElementById('game-container');
    // Очистка содержимого контейнера
    gameContainer.innerHTML = '';

    // Установка количества колонок в зависимости от размера поля
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Рассчитываем размер клеток на основе размера поля
    const cellSizeW = `calc(80vw / ${gridSize})`;
    const cellSizeH = `calc(60vh / ${gridSize})`;


    // Создание клеток игрового поля
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', toggleCell);
        // Устанавливаем стили для размера клетки
        cell.style.width = cellSizeW;
        cell.style.height = cellSizeH;
        cell.style.borderColor = gridColor; // Установка цвета грида
        gameContainer.appendChild(cell);
    }
}

// Инициализация начального состояния поля
function initializeGrid() {
    // Проход по всем клеткам и случайная установка активного состояния
    for (let i = 0; i < gridSize * gridSize; i++) {
        // Получаем ссылку на текущую клетку
        const cell = document.getElementsByClassName('cell')[i];
        
        // Убираем активное состояние у клетки (делаем ее неактивной)
        cell.classList.remove('active');

        // С вероятностью 20%, устанавливаем активное состояние (делаем клетку активной)
        if (Math.random() < 0.2) {
            cell.classList.add('active');
        }
        
        // Устанавливаем цвет клетки в соответствии с выбранным цветом
        cell.style.backgroundColor = cell.classList.contains('active') ? cellColor : '';
        // cell.style.borderColor = gridColor;        
    }
}

// Отрисовка текущего состояния поля с учетом выбора цвета клетки
function renderGrid() {
    // Получение всех клеток
    const cells = document.getElementsByClassName('cell');
    
    // Цикл по всем клеткам поля
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = i % gridSize; // Получение координаты по горизонтали
        const y = Math.floor(i / gridSize); // Получение координаты по вертикали
        const neighbors = countNeighbors(x, y); // Подсчет соседей для текущей клетки
        
        // Логика игры "Жизнь"
        if (cell.classList.contains('active')) { // Если клетка активна
            if (neighbors < 2 || neighbors > 3) { // Если соседей меньше 2 или больше 3
                cell.classList.remove('active'); // Убираем активное состояние
                cell.style.backgroundColor = ''; // Убираем цвет клетки
            }
        } else { // Если клетка неактивна
            if (neighbors === 3) { // Если ровно 3 соседа
                cell.classList.add('active'); // Устанавливаем активное состояние
                cell.style.backgroundColor = cellColor; // Устанавливаем цвет клетки
            }
        }
    }

    // Увеличение счетчика поколений
    generationCount++;
    
    // Обновление отображения текущего поколения на странице
    document.getElementById('generation').innerText = `Поколение: ${generationCount}`;
}

// Подсчет соседей для клетки
function countNeighbors(x, y) {
    // Счетчик соседей
    let count = 0;

    // Вложенные циклы для прохода по всем соседним клеткам
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // Рассчитываем координаты соседей, учитывая "торообразность" поля
            const neighborX = (x + i + gridSize) % gridSize;
            const neighborY = (y + j + gridSize) % gridSize;

            // Получаем индекс соседней клетки в одномерном массиве
            const neighborIndex = neighborY * gridSize + neighborX;

            // Получаем ссылку на соседнюю клетку по индексу
            const neighborCell = document.getElementsByClassName('cell')[neighborIndex];

            // Увеличиваем счетчик, если сосед активен и не является самой клеткой
            if (neighborCell.classList.contains('active') && !(i === 0 && j === 0)) {
                count++;
            }
        }
    }

    // Возвращаем общее количество активных соседей
    return count;
}

// Переключение состояния клетки при клике
// Добавлены стили для установки цвета клетки
function toggleCell() {
    this.classList.toggle('active');
    this.style.backgroundColor = this.classList.contains('active') ? cellColor : '';
}

// Инициализация игры при загрузке страницы
initializeGame();
