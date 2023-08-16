var board;
const user = 'O';
const bot = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame()
{
    document.querySelector('.game_end').style.display = "none";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square)
{
    if (typeof board[square.target.id] == 'number')
    {
        turn(square.target.id, user);
        if (!checkTie())
        {
            turn(bestMove(), bot);
        }
    }
}

function turn(squareId, player)
{
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(board, player);
    if (gameWon)
    {
        gameOver(gameWon);
    }
}

function checkWin(board, player)
{
    let plays = board.reduce((a, e, i) => {
        let ans;
        if(e === player)
        { 
            ans = a.concat(i)
        }
        else
        {
            ans = a;
        }
        return ans;
    }, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries())
    {
        if (win.every(elem => plays.indexOf(elem) > -1))
        {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
} 

function gameOver(gameWon)
{
    for (let i of winCombos[gameWon.index])
    {
        document.getElementById(i).style.backgroundColor = gameWon.player == user ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == user ? "You Win!" : "You Lose.");
}

function emptrySquares()
{
    return board.filter(s => typeof s == 'number');
}

function bestMove()
{
    return minimax(board, bot).index;
}

function declareWinner(who)
{
    document.querySelector('.game_end').style.display = 'block';
    document.querySelector('.game_end .winner').innerText = who;
}

function checkTie()
{
    if (emptrySquares().length == 0)
    {
        for (var i = 0; i < cells.length; i++)
        {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax (newBoard, player)
{
    var availMoves = emptrySquares(newBoard);

    if (checkWin(board, player))
    {
        return {score: -10};
    }
    else if (checkWin(board, bot))
    {
        return {score: 10};
    }
    else if (availMoves.length == 0)
    {
        return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < availMoves.length; i++)
    {
        var move = {};
        move.index = newBoard[availMoves[i]];
        newBoard[availMoves[i]] = player;

        if (player == bot)
        {
            var result = minimax(newBoard, user);
            move.score = result.score;
        }
        else
        {
            var result = minimax(newBoard, bot);
            move.score = result.score;
        }

        newBoard[availMoves[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player == bot)
    {
        var bestScore = -1000;
        for (var i = 0; i < moves.length; i++)
        {
            if (moves[i].score > bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else
    {
        var bestScore = 1000;
        for (var i = 0; i < moves.length; i++)
        {
            if (moves[i].score < bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}