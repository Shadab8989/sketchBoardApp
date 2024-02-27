let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");

let stickyNotes = document.querySelector(".sticky-notes");

pencil.addEventListener("click", (e) => {
	canvas.style.cursor = 'url("images/pencil-cursor.png") , auto';
});

eraser.addEventListener("click", (e) => {
	canvas.style.cursor = 'url("images/eraser-cursor.png") , auto';
});

stickyNotes.addEventListener("click", (e) => {
	let sticky_container = document.createElement("div");
	sticky_container.setAttribute("class", "sticky-notes-container");
	sticky_container.innerHTML = `<div class="header">
	<div class="header-fn minimize"></div>
	<div class="header-fn remove"></div>
</div>
<div class="notes">        
	<textarea spellcheck="false"></textarea>
</div>`;

	document.body.appendChild(sticky_container);

	let minimize = sticky_container.querySelector(".minimize");
	let removenote = sticky_container.querySelector(".remove");

	notesAction(minimize, removenote, sticky_container);

	sticky_container.onmousedown = function (event) {
		dragAnddrop(sticky_container, event);
	};

	sticky_container.ondragstart = function () {
		return false;
	};
});

function dragAnddrop(sticky_container, event) {
	let shiftX = event.clientX - sticky_container.getBoundingClientRect().left;
	let shiftY = event.clientY - sticky_container.getBoundingClientRect().top;

	sticky_container.style.position = "absolute";
	sticky_container.style.zIndex = 1000;

	//freely moving sticky_container functionality
	moveAt(event.pageX, event.pageY);

	// moves the sticky_container at (pageX, pageY) coordinates
	// taking initial shifts into account
	function moveAt(pageX, pageY) {
		sticky_container.style.left = pageX - shiftX + "px";
		sticky_container.style.top = pageY - shiftY + "px";
	}

	function onMouseMove(event) {
		moveAt(event.pageX, event.pageY);
	}

	// move the sticky_container on mousemove
	document.addEventListener("mousemove", onMouseMove);

	// drop the sticky_container, remove unneeded handlers
	sticky_container.onmouseup = function () {
		document.removeEventListener("mousemove", onMouseMove);
		sticky_container.onmouseup = null;
	};
}

//minimizing and closing the sticky container

// function minimizeSticky() {}

// function removeSticky() {}

function notesAction(minimize, remove, stickyCont) {
	remove.addEventListener("click", (e) => {
		stickyCont.remove();
	});

	minimize.addEventListener("click", (e) => {
		let noteCont = stickyCont.querySelector(".notes");
		let display = getComputedStyle(noteCont).getPropertyValue("display");
		if (display === "none") {
			noteCont.style.display = "block";
			stickyCont.style.height = "15rem";
		} else {
			noteCont.style.display = "none";
			stickyCont.style.height = "2rem";
		}
	});
}

//upload functionality

let upload = document.querySelector(".upload");

upload.addEventListener("click", (e) => {
	let input = document.createElement("input");
	input.setAttribute("type", "file");
	input.click();

	input.addEventListener("change", (e) => {
		let file = input.files[0];
		let url = URL.createObjectURL(file);

		let sticky_container = document.createElement("div");
		sticky_container.setAttribute("class", "sticky-notes-container");
		sticky_container.innerHTML = `<div class="header">
		<div class="header-fn minimize"></div>
		<div class="header-fn remove"></div>
		</div>
		<div class="notes">        
			<img src = "${url}" class = "upload-img">
		</div>`;

		document.body.appendChild(sticky_container);

		let minimize = sticky_container.querySelector(".minimize");
		let removenote = sticky_container.querySelector(".remove");

		notesAction(minimize, removenote, sticky_container);

		sticky_container.onmousedown = function (event) {
			dragAnddrop(sticky_container, event);
		};

		sticky_container.ondragstart = function () {
			return false;
		};
	});
});
