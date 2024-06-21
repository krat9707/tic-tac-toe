const GameBoard = () => {
    const board = [];

    for(let i = 0; i < 3; ++i)
    {
        board[i] = [];
        for(let j = 0; j < 3; ++j)
        {
            board[i].push(Cell());   
        }
    }
    
    const printBoard = () => {
        let currentBoardValues = 
            board.map(row => row.map(cell => cell.getValue()));
        
        console.log(currentBoardValues);
    }

    const placeToken = (row, column, player) => {
        board[row][column].markCell(player);
    }

    const getBoard = () => board;

    const checkResult = () => {
        let flag;

        for(let i = 0; i < 3; ++i)
        {
            flag = true;
            for(let j = 1; j < 3; ++j)
            { 
                if(board[i][j].getValue() != board[i][j-1].getValue() || board[i][j].getValue() === 0 || board[i][j-1].getValue() === 0)
                {
                    flag = false;
                    break;
                }
            }

            if(flag)
                return true;
        }

        for(let j = 0; j < 3; ++j)
        {
            flag = true;
            for(let i = 1; i < 3; ++i)
            { 
                if(board[i-1][j].getValue() != board[i][j].getValue() || board[i][j].getValue() === 0 || board[i-1][j].getValue() === 0)
                {
                    flag = false;
                    break;
                }
            }

            if(flag)
                return true;
        }

        if(board[0][0].getValue() === board[1][1].getValue() && board[0][0].getValue() === board[2][2].getValue() && board[1][1].getValue() != 0)
            return true;

        if(board[2][0].getValue() === board[1][1].getValue() && board[2][0].getValue() === board[0][2].getValue() && board[1][1].getValue() != 0)
            return true;

        return false;
    }

    const availableCells = () => {
        let count = 0;

        board.forEach(row => row.forEach(cell => count += (cell.getValue() === 0) ? 1 : 0));

        if(count === 0)
            return false;
    
        return true;
    }

    return {getBoard, printBoard, placeToken, checkResult, availableCells};
}




const Cell = () => {
    let value = 0;

    const getValue = () => value;

    const markCell = (player) => {
        value = player;
    }

    return {getValue, markCell};
} 


const GameFlow = (playerOneName = `player1`, playerTwoName = `player2`) => {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let currentTurn = players[0];

    const nextTurn = () => {
        currentTurn = (currentTurn === players[0] ? players[1] : players[0]);
    };

    const getCurrentTurn = () => currentTurn;

    const printNewRound = () => {
        board.printBoard();
        console.log(`Enter Row & Column: `);
    }

    let gameEnd = false;

    const getGameState = () => gameEnd;

    const playRound = (row, column, e) => {

        board.placeToken(row, column, getCurrentTurn().token);
        e.target.setAttribute('data-token', getCurrentTurn().token);

        printNewRound();    

        if(board.checkResult())
        {
            console.log(`${getCurrentTurn().name}'s the Winner!`);
            gameEnd = true;
            return;
        }
        else if(board.availableCells() === false)
        {
            console.log(`Draw Match!`);
            gameEnd = true;
            return;
        }

        nextTurn();
    }

    const isTokenMarked = (row, column) => board.getBoard()[row][column].getValue() != 0;

    return {playRound, getCurrentTurn, getGameState, isTokenMarked};
}

let round;

const startMatch = () => {
    round = GameFlow();
    let boxes = document.querySelectorAll('.box');
    let row = null, column = null;

    boxes.forEach((box, index) => {

        box.setAttribute('data-row', parseInt(index / 3));
        box.setAttribute('data-column', parseInt(index % 3));
        
        box.addEventListener('click', (e) => {
            row = parseInt(e.target.getAttribute('data-row'));
            column = parseInt(e.target.getAttribute('data-column'));

            nextRound(row, column, e);
        });
    })    

    const nextRound = (row, column, e) => {
        if(row != null && column != null && round.isTokenMarked(row, column) === false && round.getGameState() === false)
        {
            round.playRound(row, column, e);   
        }        
        else if(round.getGameState())
        {
            return;
        }
    }
}

document.querySelector('#start-match').addEventListener('click', () => startMatch());