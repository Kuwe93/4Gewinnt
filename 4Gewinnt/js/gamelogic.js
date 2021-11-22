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
        width;
    
    //create Gameboard by given vals of inputs to start a game
    document.querySelector('#startGame').addEventListener('click',  createGame);

    //start Game by deactivating buttons and creating the board
    function createGame (e) {
        width = document.getElementById("gamewidth").value;
        height = document.getElementById("gameheight").value;

        //create gameboard by given parameters
        createInsertHeader(width);
        createBoard(width, height);

        //set players by count -> 2 = red and blue, 3 = red & blue & green, 4 = red & blue & green & purple
        players = setPlayers(document.getElementById("playercount").value);

        //set wincondition
        wincondition = document.getElementById("wincondition").value;

        //deactivate buttons and ranges
        document.querySelector('#startGame').setAttribute("disabled", true);
        document.querySelector('#gamewidth').setAttribute("disabled", true);
        document.querySelector('#gameheight').setAttribute("disabled", true);
        document.querySelector('#playercount').setAttribute("disabled", true);
        document.querySelector('#wincondition').setAttribute("disabled", true);
    }

    //insert the amount of columns with buttons into the DOM where the game takes place
    function createInsertHeader(width) {
        let headerrow = document.getElementById("insertrow");
        for (let i = 1; i <= width; i++) {
            let thElement = document.createElement("th");
            let buttonElement = document.createElement("button");
            let buttonText = document.createTextNode(i);
            buttonElement.addEventListener('click',  insertStone);
            buttonElement.appendChild(buttonText);
            buttonElement.setAttribute("class","columnentry");
            thElement.appendChild(buttonElement);
            headerrow.appendChild(thElement);
        }
    }

    //insert the columns and rows of the gameboard
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

    //set playercount of the game
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
                //reload game if there is a not allowed playernumber!
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

    //listen for clicking on a columnbutton
    
    function insertStone (e) { 
        
        let field = e.target;
        let column = field.textContent;
        //check each row starting at the lowest if it already contains a stone
        for(let i=height; i>0; i--) {
            
            //get row
            checkedrow = document.getElementById(i);
            //get columns of row
            checkedcolumns =  checkedrow.children;
            //check if cell of the column is already colored
            if(!checkedcolumns[column-1].hasAttribute('disabled')) {
                checkedcolumns[column-1].setAttribute('aria-label', players[activePlayer]); 
                checkedcolumns[column-1].setAttribute("disabled", true);
                if (i == 1) {
                    field.setAttribute("disabled", true);
                }
                break;
            }
        }

        //change active player
        if(activePlayer < players.length-1) {
            activePlayer++;
        } else {
            activePlayer = 0;
        }
        checkIfGameEnded();
        document.querySelector('#hint').innerHTML = 'Spieler <span style="color:' + players[activePlayer] + '">' + players[activePlayer] + '</span> darf das nächste Feld einfärben.';
    }

    /**
     * Game ends if:
     * 1. Every field is claimed by a color.
     * 2. One player has the winningcondition as rows,columns or diagonals.
    */
    function checkIfGameEnded() {
        //get all fields and assume everyone is full
        let fields = document.querySelectorAll('td'),
            full = true,
            winningcounter = 0,
            lastColor = "none",
            winner;

        // check if all fields are claimed by checking the disabled attribute
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].hasAttribute('disabled')) {
                full = false;
            }
        }

        //check if the winningcondition is met
        //4 possible ways to win:

        //1. winningcondition in a row
        for(let i=height; i>0; i--) {
            let checkedrow = document.getElementById(i);
            //get columns of row
            let checkedcolumns =  checkedrow.children;
            for(let c=0; c<checkedcolumns.length; c++) {
                if(wincondition != winningcounter) {
                    if(checkedcolumns[c].hasAttribute('aria-label')){
                        if(checkedcolumns[c].getAttribute('aria-label') != lastColor) {
                            lastColor = checkedcolumns[c].getAttribute('aria-label');
                            winningcounter = 1;
                        } else {
                            winningcounter++;
                        }
                    } else {
                        winningcounter = 0;
                    }
                } else {
                    //we have a winner!
                    winner = lastColor;
                    break;
                }
            }
            winningcounter = 0;
        }

        //2. winningcondition in a column
        for(let w=0; w<width; w++) {
            for(let i=height; i>0; i--) {
                let checkedrow = document.getElementById(i);
                let checkedcolumns = checkedrow.children;
                if(winningcounter != wincondition) {
                    if(checkedcolumns[w].hasAttribute('aria-label')){
                        if(checkedcolumns[w].getAttribute('aria-label') != lastColor) {
                            lastColor = checkedcolumns[w].getAttribute('aria-label');
                            winningcounter = 1;
                        } else {
                            winningcounter++;
                        }
                    } else {
                        winningcounter = 0;
                    }
                } else {
                    //we have a winner!
                    winner = lastColor;
                    break;
                }
            }
            winningcounter = 0;
        }

        //3. winningcondition in a diagonalrow to the right
        var column = 0;
        for(let w=0; w<width; w++) {
            column = w;

            if(winningcounter == wincondition) {
                //we have a winner!
                winner = lastColor;
                break;
            }

            for(let i=height; i>0; i--) {
                //alert ('i:'+i+'column:'+column);
                if(winningcounter == wincondition) {
                    //we have a winner!
                    winner = lastColor;
                    break;
                }
                let checkedrow = document.getElementById(i);
                //get columns of row
                let checkedcolumns =  checkedrow.children;
                if(checkedcolumns[column] !== undefined){
                    if(checkedcolumns[column].hasAttribute('aria-label')){
                        if(checkedcolumns[column].getAttribute('aria-label') != lastColor) {
                            lastColor = checkedcolumns[column].getAttribute('aria-label');
                            winningcounter = 1;
                            //alert(lastColor);
                        } else {
                            winningcounter++;
                        }
                    } else {
                        winningcounter = 0;
                    }
                }
                if (column < width) {
                    column = column + 1;
                }
            }
            //reset counter
            winningcounter = 0;
        }

        //4. winningcondition in a diagonalrow to the left
        for(let w=width; w>0; w--) {
            column = w;
            for(let i=height; i>0; i--) {
                let checkedrow = document.getElementById(i);
                //get columns of row
                let checkedcolumns =  checkedrow.children;
                if(winningcounter != wincondition) {
                    if(checkedcolumns[column] !== undefined){
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
                    }
                } else {
                    //we have a winner!
                    winner = lastColor;
                    break;
                }
                column = column - 1;
            }
            //reset counter
            winningcounter = 0;
        }

        if(full || winner) {
            //game ended, because no player can claim a field anymore or a player has met the winning condition
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
}
);