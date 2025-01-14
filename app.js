// Initialize the spreadsheet grid data
const rows = 10;
const cols = 10;
let gridData = Array(rows).fill().map(() => Array(cols).fill(''));

// Create the spreadsheet grid dynamically
function createSpreadsheet() {
  const grid = document.getElementById('spreadsheet-grid');
  grid.innerHTML = '';  // Clear existing grid

  for (let row = 0; row < rows; row++) {
    const rowElement = document.createElement('tr');
    for (let col = 0; col < cols; col++) {
      const cellElement = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = gridData[row][col];
      input.addEventListener('input', (e) => updateCell(row, col, e.target.value));
      input.addEventListener('dragstart', (e) => dragStart(e, row, col));
      input.addEventListener('dragover', (e) => dragOver(e));
      input.addEventListener('drop', (e) => drop(e, row, col));
      cellElement.appendChild(input);
      rowElement.appendChild(cellElement);
    }
    grid.appendChild(rowElement);
  }
}

// Update a cell when the user types
function updateCell(row, col, value) {
  gridData[row][col] = value;
  updateFormula();
}

// Update the formula bar with the result of a formula
function updateFormula() {
  const formula = document.getElementById('formula-bar').value.trim();
  if (formula.startsWith('=SUM')) {
    const range = formula.slice(5, -1).split(':');
    const [startRow, startCol] = getCellPosition(range[0]);
    const [endRow, endCol] = getCellPosition(range[1]);

    let sum = 0;
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        sum += parseFloat(gridData[row][col]) || 0;
      }
    }
    document.getElementById('formula-bar').value = sum;
  }
}

// Convert cell reference (e.g., A1) to row/column index
function getCellPosition(cell) {
  const col = cell.charCodeAt(0) - 65;  // Convert A-Z to 0-25 (columns)
  const row = parseInt(cell.slice(1)) - 1;  // Convert 1-10 to 0-9 (rows)
  return [row, col];
}

// Apply bold formatting to the formula bar
function boldText() {
  const formulaBar = document.getElementById('formula-bar');
  formulaBar.style.fontWeight = formulaBar.style.fontWeight === 'bold' ? 'normal' : 'bold';
}

// Apply italic formatting to the formula bar
function italicText() {
  const formulaBar = document.getElementById('formula-bar');
  formulaBar.style.fontStyle = formulaBar.style.fontStyle === 'italic' ? 'normal' : 'italic';
}

// Increase font size of the formula bar
function increaseFontSize() {
  const formulaBar = document.getElementById('formula-bar');
  const currentSize = parseInt(window.getComputedStyle(formulaBar).fontSize);
  formulaBar.style.fontSize = `${currentSize + 2}px`;
}

// Decrease font size of the formula bar
function decreaseFontSize() {
  const formulaBar = document.getElementById('formula-bar');
  const currentSize = parseInt(window.getComputedStyle(formulaBar).fontSize);
  formulaBar.style.fontSize = `${currentSize - 2}px`;
}

// **Color Functionality**
// Change the background color of the selected cell
function changeColor() {
  const color = document.getElementById('color-picker').value;
  const selectedCell = document.activeElement;
  if (selectedCell.tagName === 'INPUT') {
    selectedCell.style.backgroundColor = color;
  }
}

// **Drag and Drop Functionality**
let draggedCell = null;

function dragStart(e, row, col) {
  draggedCell = { row, col };
  e.dataTransfer.setData("text/plain", `${row},${col}`);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e, row, col) {
  e.preventDefault();
  const [draggedRow, draggedCol] = draggedCell ? draggedCell : [0, 0];
  const draggedValue = gridData[draggedRow][draggedCol];
  gridData[row][col] = draggedValue;
  updateCell(row, col, draggedValue);
  createSpreadsheet(); // Re-render the spreadsheet to reflect changes
}

// **Data Quality Functions**
// TRIM: Removes leading and trailing whitespace from a cell
function trimData() {
  const formulaBar = document.getElementById('formula-bar').value.trim();
  const [row, col] = getCellPosition(formulaBar);
  gridData[row][col] = gridData[row][col].trim();
  createSpreadsheet();
}

// UPPER: Converts text in a cell to uppercase
function upperData() {
  const formulaBar = document.getElementById('formula-bar').value.trim();
  const [row, col] = getCellPosition(formulaBar);
  gridData[row][col] = gridData[row][col].toUpperCase();
  createSpreadsheet();
}

// LOWER: Converts text in a cell to lowercase
function lowerData() {
  const formulaBar = document.getElementById('formula-bar').value.trim();
  const [row, col] = getCellPosition(formulaBar);
  gridData[row][col] = gridData[row][col].toLowerCase();
  createSpreadsheet();
}

// REMOVE_DUPLICATES: Removes duplicate rows from the grid
function removeDuplicates() {
  gridData = gridData.filter((row, index, self) => 
    index === self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row))
  );
  createSpreadsheet();
}

// FIND_AND_REPLACE: Finds and replaces specific text within a range of cells
function findAndReplace() {
  const findText = prompt("Enter the text to find:");
  const replaceText = prompt("Enter the text to replace with:");
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (gridData[row][col].includes(findText)) {
        gridData[row][col] = gridData[row][col].replace(findText, replaceText);
      }
    }
  }
  createSpreadsheet();
}

// Initialize the spreadsheet on page load
createSpreadsheet();
