const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const total = document.getElementById("todo-total")
const cleanButton = document.getElementById("todo-clean")
const resetButton = document.getElementById("todo-reset");
cleanButton.style.visibility = "hidden";
resetButton.style.visibility = "hidden";
const allButton = document.getElementById("All");
const activeButton = document.getElementById("Active");
const completedButton = document.getElementById("Completed");

const max = Number(prompt("Set a maximum length!", "10"));
// console.log(max);
var used = new Array(max).fill(false);

// console.log(used);
var state = 0;
var list_items = [];


var createItem = (input_text) => {
	const id = used.findIndex(ele => !ele);
	if(id == -1){
		// console.log("too many items!");
		return -1;
	}
	
	used[id] = true;

	const itemNode = document.createElement("li");
	const wapper = document.createElement("div");
	const checkbox = document.createElement("input");
	const label = document.createElement("label");
	const text = document.createElement("h1");
	const img = document.createElement("img");


	// <li class="todo-app__item">
	// 	<div class="todo-app__checkbox">
	// 		<input id="0" type="checkbox">
	// 		<label for="0"></label>
	// 	</div>
	// 	<h1 class="todo-app__item-detail">kldfjsl</h1>
	// 	<img src="./img/x.png" class="todo-app__item-x">
	// </li>
	
	itemNode.setAttribute("class", "todo-app__item");

	wapper.setAttribute("class", "todo-app__checkbox");
	checkbox.setAttribute("id", id);
	checkbox.setAttribute("onclick", "change_condition("+id+")");
	checkbox.setAttribute("type", "checkbox");
	
	label.setAttribute("for", id);

	text.setAttribute("class", "todo-app__item-detail");
	text.textContent = input_text;


	img.setAttribute("class", "todo-app__item-x");
	img.setAttribute("src", "./img/x.png");
	img.setAttribute("onclick", "removeItem("+id+")");

	itemNode.appendChild(wapper);
	itemNode.appendChild(text);
	itemNode.appendChild(img);
	wapper.appendChild(checkbox);
	wapper.appendChild(label);

	return { node: itemNode, isCompleted: false, id: id};
};

var reset = () => {
	used = new Array(max).fill(false);
	state = 0;
	list_items = [];
	displayList(1);
};

var removeItem = (id) => {
	const targetIndex = list_items.findIndex(ele => ele.id == id);
	used[id] = false;
	list_items.splice(targetIndex, 1);
	// console.log("remove: "+id);
	displayList(1);
};

var change_condition = (id) => {
	// console.log(id);
	const target = list_items.find(ele => ele.id == id);
	if(target.isCompleted){
		target.node.classList.remove("completed");
	}else{
		target.node.classList.add("completed");
	}
	target.isCompleted = !target.isCompleted;
	// console.log(target.isCompleted);
	displayList();
}

input.addEventListener('keyup', event => {

	if(event.keyCode === 13 && event.target.value !== ''){
		// console.log(event.target.value);
		var newItem = createItem(event.target.value);
		event.target.value = '';
		if(newItem != -1){
			list_items.push(newItem);
			list.appendChild(newItem.node);
		}
		displayList();
	}
});

var displayList = (option = 0) => {

	let l;
	allButton.classList = [];
	activeButton.classList = [];
	completedButton.classList = [];

	switch(state){

		case 1:
			activeButton.classList = ["pressed"];
			l = list_items.filter(ele => !ele.isCompleted);
			break;
		case 2:
			completedButton.classList = ["pressed"];
			l = list_items.filter(ele => ele.isCompleted);
			break;
		default:
			allButton.classList = ["pressed"];
			l = list_items;
	}

	if(option == 1 || state != 0){
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}

		l.forEach(ele => list.appendChild(ele.node));
	}

	let com = 0;
	list_items.forEach(ele => {
		if(ele.isCompleted)
			com ++;
	});
	// console.log(left);
	if(com == 0){
		cleanButton.style.visibility = "hidden";
	}else{
		cleanButton.style.visibility = "visible";
	}
	if(list_items.length == 0){
		resetButton.style.visibility = "hidden";
	}
	else{
		resetButton.style.visibility = "visible";
	}
	input.style.background = (list_items.length == max) ?"rgba(255, 182, 193, 0.2)": "rgb(254, 254, 254)";
	input.placeholder = (list_items.length == max) ? "The list is FULL!":"What's your plan ......";
	total.textContent = (list_items.length - com) +" / " + list_items.length + " / " + max;
};

var setState = t => {
	if(state == t) return;
	state = t;
	displayList(1);
};

var removeCompleted = () => {
	list_items = list_items.filter(ele => {
		if(!ele.isCompleted)
			return true;
		else
			used[ele.id] = false;
			return false;
	});
	displayList(1);
};

displayList();