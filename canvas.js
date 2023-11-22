let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d");

tool.fillStyle = "white";
tool.fillRect(0, 0, canvas.width, canvas.height);

tool.strokeStyle = "black"; //default style
tool.lineWidth = "3"; //default style

let isMouseDown = false;

let colorInput = document.querySelector(".color-input");

let pencilColor = document.querySelectorAll(".pencil-color");
let color = "black";
let pencilwidth = document.querySelector(".pencil-width-input");
let pencil_thickness = pencilwidth.value;
let eraserwidth = document.querySelector(".eraser-width-input");
let eraser_thickness = eraserwidth.value;

let prevColor; //to store the pencil color before changing color value to white
let thickness = 3;

// let eraserFlag = 0;
let isEraser = false;

canvas.addEventListener("mousedown", (e) => {
	isMouseDown = true;
	// tool.beginPath();
	// tool.moveTo(e.clientX, e.clientY);
	// let thickness = pencil_thickness ? !isEraser : eraser_thickness

	// pencil_thickness = pencilwidth.value;
	let data = {
		x: e.clientX,
		y: e.clientY,
		// width: thickness ,
		color: color,
	};
	socket.emit("beginPath", data);
});

//mouse movement
canvas.addEventListener("mousemove", (e) => {
	if (isMouseDown) {
		let data = {
			x: e.clientX,
			y: e.clientY,
			width: thickness,
			color:color
		};
		socket.emit("drawStroke", data);

		// tool.lineTo(e.clientX, e.clientY);
		// tool.stroke();
	}
});

//mouse click removed
canvas.addEventListener("mouseup", (e) => {
	isMouseDown = false;
	let url = canvas.toDataURL();
	undoRedoArray.push(url);
	position = undoRedoArray.length - 1;
});

pencil.addEventListener("click", (e) => {
	if (isEraser) isEraser = false;
	color = prevColor ? prevColor : color;
	thickness = pencil_thickness;
});

//pencil width changed
pencilwidth.addEventListener("change", (e) => {
	pencil_thickness = pencilwidth.value;
	thickness = pencil_thickness;
	// tool.lineWidth = pencil_thickness;
	// tool.strokeStyle = color;
});

//eraser image clicked
eraser.addEventListener("click", (e) => {
	canvas.style.cursor = 'url("images/eraser-cursor.png") , auto';
	isEraser = true;
	// tool.strokeStyle = "white";
	// tool.lineWidth = eraserwidth.value;
	// eraser_thickness = eraserwidth.value;
	thickness = eraser_thickness;
	prevColor = color;
	color = "white";
});

//eraser width changed
eraserwidth.addEventListener("change", (e) => {
	eraser_thickness = eraserwidth.value;
	// tool.strokeStyle = "white";
	// tool.lineWidth = eraser_thickness;
	thickness = eraser_thickness;
});

//applying event listener to all the pencil colors
// pencilColor.forEach((item) =>
// 	item.addEventListener("click", (e) => {
// 		color = item.classList[0];
// 		// tool.strokeStyle = color;
// 		let data = {
// 			color: color,
// 		};
// 		socket.emit("pencilColor", data);
// 	})
// );
colorInput.addEventListener("change", (e) => {
	let value = colorInput.value;
	color = value;
});

//mouse clicked on the screen

//download functionality
let download = document.querySelector(".download");

download.addEventListener("click", (e) => {
	let url = canvas.toDataURL();
	let a = document.createElement("a");
	a.href = url;
	a.download = "custom-filename-txt";
	a.click();
});

//undo redo functionality

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let undoRedoArray = [];
let position = undoRedoArray.length - 1;

undo.addEventListener("click", (e) => {
	if (position > 0) {
		position--;
		// undoRedoFn(undoRedoArray, position);
		let data = {
			array: undoRedoArray,
			position: position,
		};
		socket.emit("undoredo", data);
	} else {
		alert("undo not possible");
	}
});

redo.addEventListener("click", (e) => {
	if (position < undoRedoArray.length - 1) {
		position++;
		// undoRedoFn(undoRedoArray, position);
		let data = {
			array: undoRedoArray,
			position: position,
		};
		socket.emit("undoredo", data);
	} else {
		alert("redo not possible");
	}
});

function undoRedoFn(array, index) {
	let url = array[index];
	let img = new Image();
	img.src = url;
	img.onload = (e) => {
		tool.drawImage(img, 0, 0, canvas.width, canvas.height);
	};
}

//frontend usage of data from the server

socket.on("beginPath", (data) => {
	//data is from server
	// tool.lineWidth = data.width;
	tool.beginPath();
	tool.moveTo(data.x, data.y);
});

socket.on("drawStroke", (data) => {
	tool.strokeStyle = data.color;
	tool.lineWidth = data.width;
	tool.lineTo(data.x, data.y);
	tool.stroke();
});

socket.on("undoredo", (data) => {
	undoRedoFn(data.array, data.position);
});

// socket.on("pencil", (data) => {
// 	tool.strokeStyle = data.color;
// 	tool.lineWidth = data.width;
// });

// socket.on("eraser", (data) => {
// 	tool.strokeStyle = data.color;
// 	tool.lineWidth = data.width;
// });

// socket.on("pencilWidth", (data) => {
// 	tool.lineWidth = data.width;
// 	// tool.strokeStyle = data.color;
// });
// socket.on("eraserWidth", (data) => {
// 	tool.lineWidth = data.width;
// 	tool.strokeStyle = data.color;
// });

// // socket.on("pencilColor", (data) => {
// // tool.strokeStyle = data.color;
// // });

// socket.on("colorInput", (data) => {
// 	tool.strokeStyle = data.color;
// });
