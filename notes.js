window.onload = function(){

	var noteIndex = -1;

	var quickAdd = document.getElementById("QuickAdd");//кнопка создать
	
	var noteEditor = document.querySelector(".note-editor");//форма

	var noteUpdate = document.querySelector(".note-update");
	
	var  updateWrap = document.querySelector(".update_wrapper");

	var textarea = document.getElementById("textarea");//поле ввода
	
	var cancelBtn = document.getElementById("cancel");//кнопка закрыть

	var cancelWrap = document.getElementById("cancel_wrap");
	
	var addButton = document.getElementById("add-button");//кнопка добавить

	var editButton = document.getElementById("edit_button"); 
	
	var addDiv = document.querySelector(".notes-grid");//класс в котором запись

	var tags = document.querySelector(".tags");
	
	var edit = document.getElementById("edit");
	
	var del = document.getElementById("del");
	
	var Search = document.getElementById("Search");

	var input = document.querySelector(".input");


	
	var addressBook = []; //массив, просто переменная в которую будем кидать данные, а потом эти данные будет брать локалсторэдж
	var searchBook = []; //массив в который будем записывать данные по поиску
	
	quickAdd.addEventListener("click", function(){ //нажимаем на открыть окно и у поля стиль отображения блочный
		noteEditor.style.display = "block";
	});
	
	Search.addEventListener("click", separateNote);

	cancelWrap.addEventListener("click", function(){ 
		updateWrap.style.display = "none";
	});

	editButton.addEventListener("click", updateNote);
	
	
	cancelBtn.addEventListener("click",function(){ //при нажатии на X скрыть форму
		noteEditor.style.display = "none";
	});
	
	addButton.addEventListener("click", addRecord); //при нажатии на кнопку добавить дергаем ф-цию
	
	addDiv.addEventListener("click", eventClick);

    function separateNote() { //по клику на кнопку "искать" срабатывает ф-ция
    	searchBook = [];
    	var inp = input.value;  //принимаем о что введено

    	for(var n in addressBook){
    		var bpm = addressBook[n].tag; //прими значение  
    		if(inp == bpm){  //если найдено совпадение того что введено в поле с объектом в массиве, тут работает только полное совпадение тегов с поле поиска и в самом элементе
    			
    			var particle = addressBook[n]; //берем весь объект под тем индексом на котором сработало условие
    			searchBook.push(particle); //добавляем в временный массив
    			addDiv.innerHTML = ''; 
    			for(var b in searchBook){
    			
    			var srng = '<div class="entry">';
				srng += '<div class="del"><a href="#" class="delbutton" data-id="' + b + '">X</a></div>';
				
			
				srng += '<div id="oneNote" contenteditable="false">' + searchBook[b].note + '</div>';
				
				srng += '<div class="update"><a href="#" class="updatebutton" data-id="' + n + '">upd</a></div>';
				
				srng += '<div class="tag" >' + searchBook[b].tag + '</div>';
					
				srng += '</div>'; 
				addDiv.innerHTML += srng;

    	}
    		}
    		
    	}
    	input.value = '';
    }

	
	function jsonStructure(textarea , tag){ //такой подход позволяет сделать правильный массив для json
		this.note = textarea;
		this.tag = tag;	
		
	}
	
	function addRecord(){ //если нажали кнопку добавить запись срабатывает
		var isNull = textarea.value!=''; //присваиваем логическое значение это дает true или false
		
		 if(isNull){ //если true
		 	//из textarea.value выделить слова начинающиеся на #
		 	var pattern =  /#[а-яёa-z]+/g; //  /#[а-яё]+/g; добавил к поиску кириллических символов поиск ангийских букв
			var tag = textarea.value.match(pattern);
			if (tag === null) {
				tag = [null];
				var obj = new jsonStructure(textarea.value, tag);
			}else{
				var obj = new jsonStructure(textarea.value , tag);
			}

			addressBook.push(obj);//в конец массива добавляем
			localStorage['notekey'] = JSON.stringify(addressBook);//превращаем массив в строку и сохраняем в хранилище. notekey -это ключ
			noteEditor.style.display = "none"; //скрываем форму
			
			textarea.value = ''; //очищаем значение поля
			
			showNote();
		}
	}

	function updateNote(){ //для обработки поля редактирования
		
		console.log(noteIndex);
		var pattern =  /#[а-яёa-z]+/g; 

			var tag = noteUpdate.innerHTML.match(pattern);

			if (tag === null) {
				tag = [null];
			}
			var obj = new jsonStructure(noteUpdate.innerHTML, tag);
			addressBook.splice(noteIndex, 1, obj);
			localStorage['notekey'] = JSON.stringify(addressBook);
			noteIndex = -1;
			updateWrap.style.display = "none"; 
			noteUpdate.innerHTML = ''; 
			
			showNote();
	}

	
	function eventClick(e){
		if(e.target.classList.contains("delbutton")){  //удалить
			var remID = e.target.getAttribute("data-id");
			
			addressBook.splice(remID, 1);
			localStorage['notekey'] = JSON.stringify(addressBook);
			showNote();
		} else if(e.target.classList.contains("updatebutton")){ //если нажали на кнопку редактировать
				console.log('Яхуу');
				updateWrap.style.display = "block";

				var remID = e.target.getAttribute("data-id");
			    noteIndex = remID;
			    var noteUp = addressBook[remID];
			
			    var id =  noteUp.note;
			    var tagIndex = noteUp.tag;

			    var pattern =  /#[а-яёa-z]+/g; 

			    var p = id;
				if (tagIndex != null) {  //А это просто бомба. Это костыль костылей. не получалось сделать так, чтобы каждый хештег в тексте совпадающий с хештегом в массиве по индексу оборачивался в цвет адекватно через цикл 
			    for (var i = 0; i < tagIndex.length ; i++) {
			    	
			    	
			    		var bomba = p.replace(tagIndex[0], '<span style="background:aqua">' + tagIndex[0] + '</span>.');
			    		var twobomba = bomba.replace(tagIndex[1], '<span style="background:aqua">' + tagIndex[1] + '</span>.');
			    		var threebomba = twobomba.replace(tagIndex[2], '<span style="background:aqua">' + tagIndex[2] + '</span>.');
			    		var fourbomba = threebomba.replace(tagIndex[3], '<span style="background:aqua">' + tagIndex[3] + '</span>.');
			    		// var fivebomba = fourbomba.replace(tagIndex[4], '<span style="background:aqua">' + tagIndex[4] + '</span>');

			    		
			    		noteUpdate.innerHTML = fourbomba;

			    	}
			}else if(tagIndex == null){
					noteUpdate.innerHTML = p;
			    	}
			    
				}	

			}
	

	function showNote(){ //срабатывает когда отработало добавление записи
		if(localStorage['notekey'] === undefined){ //если ключ не существует . такой ход конем, чтобы если что то есть в массиве, оно сразу подгружалось
			localStorage['notekey'] = "[]"; //нужно определить его как пустой массив
		} else {
			addressBook = JSON.parse(localStorage['notekey']); //записываем в массив из локал сторедж?
			addDiv.innerHTML = ''; //класс в котором запись равен стоке,обнуляем значение того что внутри, потому что если закомментить, то добавляется не по отдельности а всё вместе с предыдущим
			tags.innerHTML = '';
			for(var n in addressBook){ //в массив
				var str = '<div class="entry">';
				str += '<div class="del"><a href="#" class="delbutton" data-id="' + n + '">X</a></div>';
				

				str += '<div class="onenote" id="oneNote" contenteditable="false">' + addressBook[n].note + '</div>';
				
				str += '<div class="update"><a href="#" class="updatebutton" data-id="' + n + '">upd</a></div>';

				str += '<div class="tag">' + addressBook[n].tag + '</div>';
				
				
				str += '</div>'; 
				addDiv.innerHTML += str;
				tagNote = '<div class="tagnote">' + addressBook[n].tag  + '  /' +'</div>';
				tags.innerHTML += tagNote;

			}
		}
	}
	
	showNote(); //вызываем ф-цию, чтобы при загрузке страницы определяла есть ли что в локальном хранилище, чтобы подгрузить
	
}
