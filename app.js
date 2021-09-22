let textInput = $('#textInput'); //поле инпута
//let button = $('#textBtn');	//кнопка
let $toDoList = $('#toDoList');	//поле отображения списка
let li;
let post;

$('#textBtn').on('click', todoEvent); //обработчик кнопки

function makeList(todos){
	let list = $.map(todos, (item) =>{
		return li = `<span><li id = ${item.id} data-id = ${item.id} data-status = ${item.completed} class = "notDone"> ${item.title}</li><button id = ${item.id} class = "deleteButton">X</button></span>`;
	});

	$toDoList.html(list);	
}

let getTodos = $.get('http://localhost:3000/todos', function(){
	console.log('success');
})
	.done(function(todos){
			makeList(todos);	
		}
	)
	.fail(function(){
		console.log('error');
	})

function todoEvent(e){
	e.preventDefault();
	let inputedPoint = textInput.val();
	console.log(inputedPoint);

	post = {
		"title": inputedPoint,
		"completed": false
	}
	
	let lastElementId = getTodos.responseJSON[getTodos.responseJSON.length-1].id;
	 li = `<span><li id = ${lastElementId+1} data-id = ${lastElementId+1} data-status = ${post.completed} class = "notDone"> ${post.title}</li><button id = ${lastElementId+1} class = "deleteButton">X</button></span>`;

	 let allContent = $('#toDoList').html();
	 allContent += li;
	
	 $('#toDoList').html(allContent);

	addTodo(post);
	textInput.val('');

}

function addTodo(post){
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/todos",
		data: post,
		success: (data) => {
			console.log('success', data.title);
		},
		error: (error) => {console.log('error', error)}
	})
}

function changeTodo(id, post){
	$.ajax({
		type: "PUT",
		url: "http://localhost:3000/todos/"+id,
		data: post,
		success: (data) => {
			console.log('status changed to', data.completed);
		},
		error: (error) => {console.log('error', error)}
	})
}

function deleteItem(id){
	$.ajax({
		type: "DELETE",
		url: "http://localhost:3000/todos/"+id,
		success: () => {console.log('item deleted')},
		error: (error) => {console.log('error', error)}
	})
}

function clickLi(e){
	
	let elem = $("#" + e.target.id);
	
	let statusString = elem.attr('data-status');
	let elemId = elem.attr('data-id');
	newStatus = (statusString.toLowerCase() === 'true'); //преобразуем из "булевой" строки в булево значение
	newStatus = !newStatus;
	elem.attr('data-status', newStatus);
	let title = elem.text();

	console.log(title, newStatus, 'check')
	let changedTodo = {
		"title": title,
		"completed": newStatus
	}
	changeTodo(elemId, changedTodo);

		if(newStatus === true){
			elem.removeClass('notDone').addClass('done');
		}else if(newStatus === false){
			elem.removeClass('done').addClass('notDone');
		}//меняем цвет фона
}

function clickButton(e){
	let targetId = e.target.id;
	e.target.closest('span').remove();
	deleteItem(targetId);
}

$('#toDoList').on('click', (e) => {
	e.preventDefault();

	if(e.target.tagName === 'LI'){
		console.log('clicked li')
		clickLi(e);
	}else if(e.target.tagName === 'BUTTON'){
		console.log('clicked button')
		clickButton(e);
	}
})