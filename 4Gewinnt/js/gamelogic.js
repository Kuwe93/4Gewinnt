/**
 * Gamelogic of a simple 4 wins game, written in html,js and css.
 */

//Start JS when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

    //----------------- Game initialization --------------------

    var activePlayer = 0,
        wincondition = 4,
        players = [],
        height,
        width,
        winner,
        lastColor = "none";
    
    //start listening on click events for the startGame-Button
    document.querySelector('#startGame').addEventListener('click',  createGame);

    /**
     * start Game by deactivating buttons and creating the board
     */
    function createGame () {
        width = document.getElementById("gamewidth").value;
        height = document.getElementById("gameheight").value;

        createInsertHeader(width);
        createBoard(width, height);
        players = setPlayers(document.getElementById("playercount").value);
        wincondition = document.getElementById("wincondition").value;

        //deactivate buttons and ranges
        document.querySelector('#startGame').setAttribute("disabled", true);
        document.querySelector('#gamewidth').setAttribute("disabled", true);
        document.querySelector('#gameheight').setAttribute("disabled", true);
        document.querySelector('#playercount').setAttribute("disabled", true);
        document.querySelector('#wincondition').setAttribute("disabled", true);
    }

    /**
     * insert the amount of columns with buttons into the DOM where the game takes place
     * @param {*} width the amount of columns where the players can claim fields
     */
    function createInsertHeader(width) {
        let headerrow = document.getElementById("insertrow");
        for (let i = 1; i <= width; i++) {
            let thElement = document.createElement("th");
            let buttonElement = document.createElement("button");
            let buttonText = document.createTextNode(i);
            buttonElement.addEventListener('click',  makeTurn);
            buttonElement.appendChild(buttonText);
            buttonElement.setAttribute("class","columnentry");
            thElement.appendChild(buttonElement);
            headerrow.appendChild(thElement);
        }
    }

    /**
     * insert the columns and rows of the gameboard
     * @param {*} width sets the amount of td-elements per row for the game
     * @param {*} height sets the amount of rows for the game
     */
    function createBoard(width, height) {
        let domTable = document.getElementById("board");
        for (let h = 1; h <= height; h++) {
            let trElement = document.createElement("tr");
            trElement.setAttribute("id",h);
            for (let w = 1; w <= width; w++) {
                let tdElement = document.createElement("td");
                trElement.appendChild(tdElement);
            }           
            domTable.appendChild(trElement);
        }
    }

    /**
     * set playercount of the game.
     * You can play with up to 8 Players. Each one gets a unique color to identify.
     * @param {*} playercount the input of the range playercount from the frontpage
     * @returns an array of the colors for each player.
     */
    function setPlayers(playercount) {
        switch(playercount) {
            case "2":
                playingplayers = ["red", "blue"];
                break;
            case "3":
                playingplayers = ["red", "blue", "green"];
                break;
            case "4":
                playingplayers = ["red", "blue", "green", "purple"];
                break;
            case "5":
                playingplayers = ["red", "blue", "green", "purple", "pink"];
                break;
            case "6":
                playingplayers = ["red", "blue", "green", "purple", "pink", "orange"];
                break;
            case "7":
                playingplayers = ["red", "blue", "green", "purple", "pink", "orange", "cyan"];
                break;
            case "8":
                playingplayers = ["red", "blue", "green", "purple", "pink", "orange", "cyan", "Brown"];
                break;
            default: 
                alert("Not allowed Playercount selected!");
                if(confirm("Do you want to reload the page to reset? If no, game starts with 2 players.")) {
                    location.reload();
                } else {
                    playingplayers = ["red", "blue"];
                }
                break;
        }
        return playingplayers;
    }

    //----------------- Game Logic --------------------

    /**
     * Method to make a turn in the game
     * @param {*} e the point where the user clicked
     */
    function makeTurn (e) { 
        let field = e.target;     
        insertStone(field);
        switchActivePlayer();
        checkIfGameEnded();
        document.querySelector('#hint').innerHTML = 'Spieler <span style="color:' + players[activePlayer] + '">' + players[activePlayer] + '</span> darf das nächste Feld einfärben.';
    }

    /**
     * Method to claim a field on the Board.
     * @param {*} column is the column which the user clicked
     */
    function insertStone (field) {
        let column = field.textContent;
        for(let i=height; i>0; i--) {
            let checkedrow = document.getElementById(i);
            let checkedcolumns =  checkedrow.children;
            //check if cell of the column is already colored
            if(!checkedcolumns[column-1].hasAttribute('disabled')) {
                checkedcolumns[column-1].setAttribute('aria-label', players[activePlayer]); 
                checkedcolumns[column-1].setAttribute("disabled", true);
                //deactivate Button if Column gets full with this click
                if (i == 1) {
                    field.setAttribute("disabled", true);
                }
                break;
            }
        }
    }
    
    /**
     * Changes to active Player who can make his next turn
     */
    function switchActivePlayer() {
        if(activePlayer < players.length-1) {
            activePlayer++;
        } else {
            activePlayer = 0;
        }
    }

    /**
     * Game ends if:
     * 1. Every field is claimed by a color.
     * 2. One player has the winningcondition as rows,columns or diagonals.
    */
    function checkIfGameEnded() {
        let full = checkIfBoardIsFull();
        if (checkRowWinCondition()) {
            winner = checkRowWinCondition();
        }
        if (checkColWinCondition()) {
            winner = checkColWinCondition();
        }
        if (checkDiagonalRightWinCondition()) {
            winner = checkDiagonalRightWinCondition();
        }
        if (checkDiagonalLeftWinCondition()) {
            winner = checkDiagonalLeftWinCondition();
        }
        //game ended, because no player can claim a field anymore or a player has met the winning condition
        if(full || winner) {
            if(winner) {
                if(confirm('Spieler ' + winner + ' hat gewonnen! Neues Spiel?')) {
                    location.reload();
                };
            } else {
                if(confirm('Es gibt keine freien Flächen mehr! Das Spiel endet unentschieden! Neues Spiel?')) {
                    location.reload();
                };
            }
        }
    }

    /**
     * Checks each field of the board if it is claimed by a color.
     * @returns boolean true if all fields of the board are full, if not false.
     */
    function checkIfBoardIsFull() {
        let fields = document.querySelectorAll('td');
        let full = true;
        // check if all fields are claimed by checking the disabled attribute
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].hasAttribute('disabled')) {
                full = false;
            }
        }
        return full;
    }

    /**
     * Checks if a color has claimed enough fields of a row to win the game.
     * @returns the winner for a met wincondition
     */
    function checkRowWinCondition() {
        let winningcounter = 0;
        for(let i=height; i>0; i--) {
            let checkedrow = document.getElementById(i);
            let checkedcolumns = checkedrow.children;
            for(let c=0; c<checkedcolumns.length; c++) {
                if(checkWinCondition(winningcounter)){
                    break;
                }
                winningcounter = checkField(winningcounter, checkedcolumns, c);
            }
            winningcounter = 0;
        }
        return winner;
    }

    /**
     * Checks if a color has claimed enough fields of a col to win the game.
     * @returns the winner for a met wincondition
     */
    function checkColWinCondition() {
        let winningcounter = 0;
        for(let w=0; w<width; w++) {
            for(let i=height; i>0; i--) {
                let checkedrow = document.getElementById(i);
                let checkedcolumns = checkedrow.children;
                if(checkWinCondition(winningcounter)){
                    break;
                }
                winningcounter = checkField(winningcounter, checkedcolumns, w);
            }
            winningcounter = 0;
        }
        return winner;
    }

    /**
     * Checks if a color has claimed enough fields of a diagonalrow to the right to win the game.
     * @returns the winner for a met wincondition
     */
    function checkDiagonalRightWinCondition() {
        let column = 0,
        winningcounter = 0;       
        for(let w=0; w<width; w++) {
            column = w;
            if(checkWinCondition(winningcounter)){
                break;
            }
            for(let i=height; i>0; i--) {
                if(checkWinCondition(winningcounter)){
                    break;
                }
                let checkedrow = document.getElementById(i);
                let checkedcolumns =  checkedrow.children;
                if(checkedcolumns[column] !== undefined){
                    winningcounter = checkField(winningcounter, checkedcolumns, column);
                }
                if (column < width) {
                    column = column + 1;
                }
            }
            winningcounter = 0;
        }
        return winner;
    }

    /**
     * Checks if a color has claimed enough fields of a diagonalrow to the left to win the game.
     * @returns the winner for a met wincondition
     */
    function checkDiagonalLeftWinCondition() {
        let column = 0,
        winningcounter = 0;
        for(let w=width; w>0; w--) {
            if(checkWinCondition(winningcounter)){
                break;
            }
            column = w;
            for(let i=height; i>0; i--) {
                if(checkWinCondition(winningcounter)){
                    break;
                }
                let checkedrow = document.getElementById(i);
                let checkedcolumns =  checkedrow.children;
                if(checkedcolumns[column] !== undefined){
                    winningcounter = checkField(winningcounter, checkedcolumns, column);
                }
                column = column - 1;
            }
            winningcounter = 0;
        }
        return winner;
    }

    /**
     * Checks a single Field of the board if it is the same color as the last one and increases the counter afterwards.
     * @param {*} winningcounter the actual counter for the checked fields
     * @param {*} checkedcolumns the array containing all columns
     * @param {*} column the columncount for the field which is going to be checked
     * @returns the winningcounter after checking the field
     */
    function checkField(winningcounter, checkedcolumns, column) {
        if(checkedcolumns[column].hasAttribute('aria-label')){
            if(checkedcolumns[column].getAttribute('aria-label') != lastColor) {
                lastColor = checkedcolumns[column].getAttribute('aria-label');
                winningcounter = 1;
            } else {
                winningcounter++;
            }
        } else {
            winningcounter = 0;
        }
        return winningcounter;
    }

    /**
     * checks if the given winningcounter mets the winningcondition 
     * @param {*} winningcounter the actual counter which should be compared with the overall winningcondition
     * @returns boolean true if a winner is found
     */
    function checkWinCondition(winningcounter) {
        if(winningcounter == wincondition) {
            winner = lastColor;
            return true;
        }
    }
}
);