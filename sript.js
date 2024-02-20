let currentPlayer = 'circle'; // Start with 'circle'
let gameEnded = false; // Variable to track if the game has ended


let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];

function init() {
    render();
}

function render() {
    // Get the div with the ID "gameTable"
    var gameTableDiv = document.getElementById("gameTable");

    // Generate the HTML code for the table
    var html = '<table>';
    for (var i = 0; i < 3; i++) {
        html += '<tr>';
        for (var j = 0; j < 3; j++) {
            // Calculate the index in the fields array corresponding to this cell
            var index = i * 3 + j;
            // Add onclick and onmouseover functions to each cell
            html += `<td id="cell-${index}" onclick="cellClicked(${index})" onmouseover="cellHover(${index}, true)" onmouseout="cellHover(${index}, false)" style="cursor: ${fields[index] === null ? 'pointer' : 'auto'}; position: relative;">`;
            // Determine the content of the cell based on the fields array
            var content = fields[index] === 'circle' ? generateCircleSVG() : (fields[index] === 'cross' ? generateCrossSVG() : '');
            // Add the content to the HTML code
            html += content;
            // Close the cell
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';

    // Insert the HTML code into the gameTableDiv
    gameTableDiv.innerHTML = html;
}

function cellClicked(index) {
    // If the cell is empty, place the current player's symbol and toggle the player
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        document.getElementById("cell-" + index).innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        // Check for win
        checkWin();
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        // Remove cursor pointer
        document.getElementById("cell-" + index).style.cursor = 'auto';
    }
}

function cellHover(index, isHovering) {
    // Highlight the cell if it's empty and the cursor is hovering over it
    if (fields[index] === null && isHovering) {
        document.getElementById("cell-" + index).style.background = 'rgba(173, 216, 230, 0.5)';
    } else {
        document.getElementById("cell-" + index).style.background = '';
    }
}

function checkWin() {
    // If the game has ended, return immediately
    if (gameEnded) {
        return;
    }

    // Define winning combinations
    const winCombinations = [
        // Rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // Columns
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        // Diagonals
        [0, 4, 8], [2, 4, 6]
    ];

    // Check each winning combination
    for (let combination of winCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Draw a thicker line connecting the winning icons
            drawLineBetweenCells(a, b, 'white', 4);
            drawLineBetweenCells(b, c, 'white', 4);

            // Display the winner
            document.getElementById("winner").innerHTML = `${currentPlayer.toUpperCase()} wins!`;

            // Set gameEnded to true to prevent further checks
            gameEnded = true;

            // Display the restart button
            document.getElementById("restartButton").style.display = "block";

            return;
        }
    }

    // Check if all fields are filled without a winner
    if (allCellsFilled()) {
        // Set gameEnded to true to prevent further checks
        gameEnded = true;

        // Display the restart button
        document.getElementById("restartButton").style.display = "block";
    }
}

function allCellsFilled() {
    return fields.every(cell => cell !== null);
}

function drawLineBetweenCells(cellIndex1, cellIndex2) {
    const cell1 = document.getElementById("cell-" + cellIndex1);
    const cell2 = document.getElementById("cell-" + cellIndex2);

    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;

    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const line = document.createElement("div");
    line.classList.add("winner-line"); // Add class "winner-line"
    line.style.position = "absolute";
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.width = `${distance}px`;
    line.style.height = "4px";
    line.style.backgroundColor = "white";
    line.style.transformOrigin = "left center";
    line.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(line);
}

function restartGame() {
    // Reset game variables
    currentPlayer = 'circle';
    fields = [
        null, null, null,
        null, null, null,
        null, null, null,
    ];

    // Clear the game board
    render();

    // Hide the restart button
    document.getElementById("restartButton").style.display = "none";

    // Clear the winner message
    document.getElementById("winner").innerHTML = "";

    // Remove any existing winner lines from the DOM
    var winnerLines = document.querySelectorAll(".winner-line");
    winnerLines.forEach(line => line.remove());
}

function generateCircleSVG() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="0" fill="#00B0EF">
                <animate attributeName="r" from="0" to="30" dur="0.25s" fill="freeze" />
            </circle>
            <circle cx="35" cy="35" r="0" fill="#323232">
            <animate attributeName="r" from="0" to="25" dur="0.25s" fill="freeze" />
        </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" style="transform: rotate(45deg)">
            <defs>
                <linearGradient id="crossGradient">
                    <stop offset="0%" stop-color="#FFC000" stop-opacity="0" />
                    <stop offset="100%" stop-color="#FFC000" stop-opacity="1" />
                </linearGradient>
            </defs>
            <line id="line1" x1="0" y1="35" x2="70" y2="35" stroke="transparent" stroke-width="6">
                <animate attributeName="stroke" dur="0.25s" values="transparent; #FFC000" fill="freeze" />
            </line>
            <line id="line2" x1="35" y1="0" x2="35" y2="70" stroke="transparent" stroke-width="6">
                <animate attributeName="stroke" begin="0.125s" dur="0.25s" values="transparent; #FFC000" fill="freeze" />
            </line>
        </svg>
    `;
}