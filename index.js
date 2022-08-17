let XSVG = `<svg class="X" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M 0 0 l 24 24"/><path d="M 24 0 l -24 24"/></svg>`;

let OSVG = `<svg class="O" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M 12 0 a 12 12 0 1 0 0 24 a 12 12 0 1 0 0 -24" /></svg>`;

let xdiv = document.querySelector(".x-score");
let odiv = document.querySelector(".o-score");
let select = document.querySelector(".playerSelect");
let resetBtn = document.querySelector(".resetBtn");
let winner = document.querySelector(".Winner");
let cells = document.querySelectorAll(".cell");

let game_started = false;
let playerSymbol = "X";
let x_score = 0;
let o_score = 0;
let compBoard, aiSymbol, aiPlayer;
xdiv.querySelector(".icon").innerHTML=XSVG;  //changes the symbol of scoreboard
odiv.querySelector(".icon").innerHTML=OSVG;

let board = [
    ["","",""],
    ["","",""],
    ["","",""],
];

initAI(true);

function startGame(){
    game_started=true;
    cells.forEach(c=>{
        c.style.pointerEvents = "all";
        /*Initailly all the cells can take 
        kinds of pointer events like click 
        hover etc.*/
    })
    select.style.pointerEvents = "none";
    xdiv.style.pointerEvents = "none";          
    odiv.style.pointerEvents = "none";
    /*once the game is started we cannot change the player or change the 
    which player takes x or o so thats why pointer events are changed to none
    */
}

function endGame(){
    game_started=false;
    cells.forEach(c=>{
        c.style.pointerEvents = "none";
        /*once the game ends all the cells cannot take 
        any kinds of pointer events like click 
        hover etc.*/
    })
    select.style.pointerEvents = "all";
    xdiv.style.pointerEvents = "all";
    odiv.style.pointerEvents = "all";
    /*once the game ends we can change the player or change the 
    which player takes x or o so thats why pointer events are changed to all
    */
}

function decalreWinner(win){
    if(win!="DRAW"){
        win == "X" ? x_score++ : o_score++;  //incrementing the scores based on the winner
        win == "X" 
            ? (xdiv.querySelector(".score").innerHTML=x_score)
            : (odiv.querySelector(".score").innerHTML=o_score); //changing the scores using innerHTMl
        
        let svg = win =="X" ? XSVG : OSVG;
        let str = `<div class = "icon">${svg}</div> is the winner!`;
        winner.innerHTML = str;   //declaring the winner and printing in screen

    }
    else if(win=="DRAW"){
        winner.innerHTML = "Draw!"; //printing draw 
    }
    winner.style.display = "flex";
}

function checkWinner(){
    let diag1 = [board[0][0],board[1][1],board[2][2]];
    let diag2 = [board[0][2],board[1][1],board[2][0]];
    let col1  = [board[0][0],board[1][0],board[2][0]];
    let col2  = [board[0][1],board[1][1],board[2][1]];
    let col3  = [board[0][2],board[1][2],board[2][2]];

    /*Note board array already has all the row elements so now we are
      pushing the diagonals and the columns*/  
    let a=board.concat([diag1,diag2]);
    a.push(col1);
    a.push(col2);
    a.push(col3);

    for(let i=0;i<a.length;i++){
        let win = a[i].every(k => k!="" && k==a[i][0]);
        if(win){
            let winner=a[i][0];
            endGame();
            decalreWinner(winner);
            return true;
        }
    }
    //flat() ==> converts all the individual subarrays into single array
    if(board.flat().every(k=> k !="")){   
        decalreWinner("DRAW");
        endGame();
    }
    return false;
}

function updateBoard(val,row,col){
    board[row][col]=val;
}

function makeMove(cell,playerSymbol){
    cell.style.pointerEvents="none";
    let svg = cell.querySelector(`.${playerSymbol}`);
    svg.style.display="block";
    setTimeout(()=>{
        svg.style.strokeDashoffset="0";
    },1);

    // parentElement ==> returns parent of corresponding element
    //classList ==>returns the classname of the element
    //replace ==>replaces the characters from the string with given characters

    let row = cell.parentElement.classList[1].replace("row","")*1-1 ;
    let col = cell.classList[1].replace("cell","")*1-1;
    updateBoard(playerSymbol,row,col);
    checkWinner();
}

function initAI(flag){
    if(flag){
        compBoard = new TicTacToe.TicTacToeBoard(board.flat());
        aiSymbol = compBoard.oppositePlayer(playerSymbol);
        aiPlayer = new TicTacToe.TicTacToeAIPlayer();
        aiPlayer.initialize(aiSymbol,compBoard);
    }
    else{
        compBoard.updateBoard(board.flat());
        aiPlayer.updateBoard(board.flat());
    }
}

xdiv.addEventListener("click",(e)=>{
    playerSymbol="X";
    xdiv.classList.add("playerActive");
    odiv.classList.remove("playerActive");
    initAI(true);
})

odiv.addEventListener("click",(e)=>{
    playerSymbol="O";
    odiv.classList.add("playerActive");
    xdiv.classList.remove("playerActive");
    initAI(true);
})

cells.forEach(cell=>{
    cell.innerHTML=XSVG+OSVG;
    cell.addEventListener("click", function click(e){
        if(!select.value){
            alert("choose a player");
            return;
        }
        if(!game_started){
            startGame();
        }
        if(select.value=="human"){
            makeMove(e.target,playerSymbol);
            playerSymbol = playerSymbol =="X" ?"O":"X";
        }
        else{
            makeMove(e.target,playerSymbol);
            initAI(false);
            let move = aiPlayer.makeMove();
            if(move!=null){
                let [index,s]= compBoard.makeMove(aiSymbol,move);
                setTimeout(()=>{
                    makeMove(cells[index],s);
                },400);
            }
        }
    });
});

resetBtn.addEventListener("click",(e)=>{
    game_started=false;
    winner.style.display="none";
    playerSymbol = document.querySelector(".playerActive svg").classList[0];
    board = board.map(b =>b.map(()=>""));
    cells.forEach(c=>{
        c.style.pointerEvents="all";
        c.querySelectorAll("svg").forEach(s=>{
            s.style.display="none";
            s.style.strokeDashoffset = s.classList.contains("X") ? "36" : "76";
        })
    })
    xdiv.style.pointerEvents="all";
    odiv.style.pointerEvents="all";
    select.style.pointerEvents="all";
})


