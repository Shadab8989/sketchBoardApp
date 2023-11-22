const express = require("express"); //access
const socket = require("socket.io");

const app = express(); //initialize and server ready

app.use(express.static(__dirname));

let port = 3000;
let server = app.listen(port, () => {
	console.log("Listening to port" + port);
});

let io = socket(server);

io.on("connection", (socket) => {

	//received data
	socket.on("beginPath", (data) => {
		//data is from frontend
		//now transfer data to all the connected clients
		io.sockets.emit("beginPath", data);
	});

    socket.on('drawStroke',(data) => {
        io.sockets.emit("drawStroke",data);
    })

    socket.on("undoredo",(data) => {
        io.sockets.emit('undoredo',data);
    })

//     socket.on("pencil",(data) => {
//         io.sockets.emit("pencil",data)
//     })
    
//     socket.on("eraser",(data) => {
//         io.sockets.emit("eraser",data)
//     })

//     socket.on("pencilWidth",(data) =>{
//         io.sockets.emit("pencilWidth",data);
//     })
//     socket.on("eraserWidth",(data) =>{
//         io.sockets.emit("eraserWidth",data);
//     })
//     // socket.on("pencilColor",(data) =>{
//     //     io.sockets.emit("pencilColor",data);
//     // })

//     socket.on('colorInput',(data) => {
//         io.sockets.emit('colorInput',data);
//     })
});

