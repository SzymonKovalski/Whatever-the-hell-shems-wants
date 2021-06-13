/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
// 0 - empty
// 1 - black
// 2 - white

'use strict';
// ||x
// \/ y->
const bblack = 2;
const wwhite = 1;
const Bblack = 4;
const Wwhite = 3;
const theBoard = [
	[0, bblack, 0, bblack, 0, bblack, 0, bblack],
	[bblack, 0, bblack, 0, bblack, 0, bblack, 0],
	[0, bblack, 0, bblack, 0, bblack, 0, bblack],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[wwhite, 0, wwhite, 0, wwhite, 0, wwhite, 0],
	[0, wwhite, 0, wwhite, 0, wwhite, 0, wwhite],
  	[wwhite, 0, wwhite, 0, wwhite, 0, wwhite, 0]
];

//const winner = 0;
//black go first

/*var turn = 0;
//turn system

while (winner === 0){
	if (turn === 0){
		Black_Turn();
	}else{
		White_Turn();
	}
}
*/

//player turn version
blackTurn();

function blackTurn() {

	console.log('your turn');
	console.table(theBoard);
	display_Board();

	const inputStartX = prompt('Enter X pos of your token', [0]);
	const inputStartY = prompt('Enter Y pos of your token', [0]);

	if (theBoard[inputStartX][inputStartY] === wwhite || Wwhite) { // antipattern 7. idiotproof this
		//put where you can move to here

		const inputEndY = prompt('do you want to move to the right?', [1]);
		const inputEndX = -1;
		if (theBoard[inputStartX - 1][inputStartY + inputEndY] === 0) {
			moveThisToThat(inputStartX, inputStartY, inputEndX, inputEndY);
			whiteTurn();
		}

	} else prompt('that is not your token');
}
//white turn version. do AI with this one
const chooseMoveX = {
	0: 0,
	'leftUp': -1,
	'rightUp': -1,
	'leftDown': +1,
	'rightDown': +1,
	'leftUpJump': -1,
	'rightUpJump': -1,
	'leftDownJump': +1,
	'rightDownJump': +1,
};
const chooseMoveY = {
	0: 0,
	'leftUp': -1,
	'rightUp': +1,
	'leftDown': -1,
	'rightDown': +1,
	'leftUpJump': -1,
	'rightUpJump': +1,
	'leftDownJump': -1,
	'rightDownJump': +1,
};
const boardLength = 8;
let possibleEnemyMoves = makeArray(8, 8, 4, 0);
let numberPossibilities = 0;

function whiteTurn() {
	let inputStartX = 0;
	let inputStartY = 0;

	console.log('enemy turn');
	console.table(theBoard);

	catalogueAllMoves(); //either 0 for player or 1 for enemies
	const randomNumber = Math.floor((Math.random() * numberPossibilities));
	let counter = 0;
	let chosenMove = 0;
	for (let i = 0; i < boardLength; i++) {
		for (let j = 0; j < boardLength; j++) {
			for (let k = 0; k < 4; k++) {
				if ((possibleEnemyMoves[i][j][k] !== 0) && (theBoard[i][j] === bblack || Bblack) && (counter < randomNumber)) {		//way too long
					counter++;
					inputStartX = i;
					inputStartY = j;
					chosenMove = possibleEnemyMoves[i][j][k];
				}
			}
		}
	}

	//now we have coords and move
	console.log(inputStartX);
	console.log(inputStartY);
	console.log(chosenMove);
	const checkX = inputStartX + chooseMoveX[chosenMove];
	const checkY = inputStartY + chooseMoveY[chosenMove];
	if (theBoard[checkX][checkY] === 0) {
		if (chosenMove === 'leftUp' || 'rightUp' || 'rightDown' || 'leftDown') { // this is 100% an antipattern
			moveThisToThat(inputStartX, inputStartY, chooseMoveX[chosenMove], chooseMoveY[chosenMove]);
			console.log('AI is not retarded ', chosenMove);
		} else {
			moveThisToThatAgressively(inputStartX, inputStartY, chooseMoveX[chosenMove], chooseMoveY[chosenMove]);
			console.log('AI is not retarded ', chosenMove);
		}
	}
}
//8 move variations. if any slot != 0 can move
/*
leftUpJump      		rightUpJump
  		leftUp   	rightUp
    			0
	  leftDown		rightDown
leftDownJump       		rightDownJump
*/

function catalogueAllMoves() {
	possibleEnemyMoves = makeArray(8, 8, 4, 0);

	numberPossibilities = 0;
	for (let i = 0; i < boardLength; i++) {
		for (let j = 0; j < boardLength; j++) {
			let k = 0;
			if (theBoard[i + 1][j - 1] === 0 && i < (boardLength) && j > 0) {
				possibleEnemyMoves[i][j][k] = 'leftDown';
				k++;
				numberPossibilities++;
			}
			if (theBoard[i + 1][j + 1] === 0 && i < (boardLength - 1) && j < (boardLength)) {
				possibleEnemyMoves[i][j][k] = 'rightDown';
				k++;
				numberPossibilities++;
			}
			if ((theBoard[i + 1][j - 1] === (wwhite || Wwhite)) && (theBoard[i + 2][j - 2] === 0) && i < (boardLength - 1) && j < 1) {
				possibleEnemyMoves[i][j][k] = 'leftDownJump';
				k++;
				numberPossibilities++;
			}
			if ((theBoard[i + 1][j + 1] === (wwhite || Wwhite)) && (theBoard[i + 2][j + 2] === 0) && i < (boardLength - 1) && j < (boardLength - 1)) {
				possibleEnemyMoves[i][j][k] = 'rightDownJump';
				k++;
				numberPossibilities++;
			}
			if (theBoard[i][j] === 4) { //kings
				if (theBoard[i - 1][j - 1] === 0 && i > 0 && j > 0) {
					possibleEnemyMoves[i][j][k] = 'leftUp';
					k++;
					numberPossibilities++;
				}
				if (theBoard[i - 1][j + 1] === 0 && i > 0 && j < (boardLength)) {
					possibleEnemyMoves[i][j][k] = 'rightUp';
					k++;
					numberPossibilities++;
				}
				if ((theBoard[i - 1][j - 1] === (wwhite || Wwhite)) && (theBoard[i + 2][j - 2] === 0) && i > 1 && j > 1) {
					possibleEnemyMoves[i][j][k] = 'leftUpJump';
					k++;
					numberPossibilities++;
				}
				if ((theBoard[i - 1][j - 1] === (wwhite || Wwhite)) && (theBoard[i + 2][j - 2] === 0) && i > 1 && j < (boardLength - 2)) {
					possibleEnemyMoves[i][j][k] = 'rightUpJump';
					k++;
					numberPossibilities++;
				}
			} // antipattern 6. if 0 somehow gets in here it wouldd crash.
		}
	}
}
//functiom moves piece
function moveThisToThat(startX, startY, right, down) { //right and down are +-1
	const endX = startX + right;
	const endY = startY + down;

	//base movement only if not killing
	const temp = theBoard[startX][startY];
	theBoard[startX][startY] = 0;
	theBoard[endX][endY] = temp;
}

function moveThisToThatAgressively(startX, startY, right, down) {
	const temp = theBoard[startX][startY];
	theBoard[startX][startY] = 0;
	theBoard[startX + right][startY + down] = 0;
	theBoard[startX + 2 * right][startY + 2 * down] = temp;
}

function makeArray(w, h, d, val) {
	const arr = [];
	for (let i = 0; i < h; i++) {
		arr[i] = [];
		for (let j = 0; j < w; j++) {
			arr[i][j] = [];
			for (let k = 0; k < d; k++) {
				arr[i][j][k] = val;
			}
		}
	}
	return arr;
}
/*
function displayClass(type) {
	switch (type) {
		case 1:
			return 'black-piece';
		case 2:
			return 'red-piece';
	}
	return 'noPieceHere';

}
*/
/*function displayBoard() {
	let id = 0;

	for (let row = 0; row < 8; row++) {
		for (let square = 0; square < 8; square++) {
			const doc = document.getElementById(id);

			doc.className = className.replace(displayClass(theBoard[row][square]));
			id++;
		}
	}
}*/
