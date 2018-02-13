let form = document.querySelector('#form');
let input = document.querySelector('#input');
let listContainer = document.querySelector('#mainList');
let filter = document.querySelector('#filter');
let clear = document.querySelector('#clear');
let inputContainer = document.querySelector('.inputRenameContainer');
let formRename = document.querySelector('#formRename');
let inputRename = document.querySelector('#inputRename');
let submitRename = document.querySelector('#submitRename');
let cancelBtn = document.querySelector('#cancelRename');



addEventListeners();

//Creating function for launching all event listeners
function addEventListeners() {


    // Cancelling renamig process
    cancelBtn.addEventListener('click', cancelRename);

    //Displaying local storage content when load 
    document.addEventListener('DOMContentLoaded', displayLocalStorageInner);

    //Add list when submitting
    form.addEventListener('submit', addTask);

    //Rename list item
    listContainer.addEventListener('dblclick', renameItem);

    //Remove task from list
    listContainer.addEventListener('click', removeTask);

    //Filtering tasks 
    filter.addEventListener('keyup', filterTasks);

    //Clearing list
    clear.addEventListener('click', clearList);
}

//Displaying the inner of local storage when DOM loaded
function displayLocalStorageInner() {

    //Regular if statement to create 'tasks' variable
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {

        //Creating main list items with our input value
        let list = document.createElement('li');
        list.className = 'listItem';
        list.appendChild(document.createTextNode(task));

        //Creating delete list nodes
        let link = document.createElement('a');
        link.className = 'deleteItem';
        link.innerHTML = '<i class="fa fa-remove"></i>';

        //Appending elements to their parents
        list.appendChild(link);
        listContainer.appendChild(list);
    })


}

//Adding tasks function
function addTask(e) {


    try {
        //Avoid empty tasks
        if (input.value == '') {
            document.querySelector('#errorDisplay2').style.display = 'block';
            var time = setTimeout(displayMainError, 2000);
            throw new Error('Please enter some text!');
        } else {
            //Avoid duplication
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
            }

            try {
                //Avoid repetition of tasks name
                if (tasks.indexOf(input.value.toLowerCase()) != -1) {

                    document.querySelector('#errorDisplay2').style.display = 'block';
                    let time = setTimeout(displayMainError, 2000);
                    throw new Error('This task already exists!!!');
                    
                } else {

                    //Creating main list items with our input value
                    let list = document.createElement('li');

                    list.className = 'listItem';
                    list.appendChild(document.createTextNode(input.value));

                    //Delete icon
                    let link = document.createElement('a');
                    link.className = 'deleteItem';
                    link.innerHTML = '<i class="fa fa-remove"></i>';

                    //Appending elements to their parents
                    list.appendChild(link);
                    listContainer.appendChild(list);

                    //Adding tasks to local storage
                    addToLocalStorage();

                    //Emptying the input after adding task
                    input.value = '';
                }
            }
            catch (error) {
                document.querySelector('#errorDisplay2 h2').innerHTML = error.message;
            }
        }
    }
    catch (error) {
        document.querySelector('#errorDisplay2 h2').innerHTML = error.message;
    }


    //Prevent submit btn from default behaviour
    e.preventDefault();
}

//Add list item to Local Storage
function addToLocalStorage() {
    //Regular if statement to create 'tasks' variable
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    //Using push() method to add new input value to the local storage
    tasks.push(input.value);

    //Updating local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Hiding error field
function displayMainError() {
    document.querySelector('#errorDisplay2').style.display = 'none';
    return;
}

//Rename form displaying
function renameItem(e) {

    //Displaying the form for renaming after event occurs
    if (e.target.classList.contains('listItem')) {

        inputContainer.style.display = 'block';

        inputRename.focus();
        //Filling input 
        inputRename.value = e.target.firstChild.textContent;

        var targetElem = e.target.firstChild.textContent;

        //Attaching of submit event to the form  and passing textContent of the clicked listItem
        formRename.onsubmit = function (e) { renameTaskInner(e, targetElem) };

    }
}


//Submit renameForm function
function renameTaskInner(e, elem) {

    let text = elem;
    let inputValue = inputRename.value;

    try {
        //Predicting creating empty tasks
        if (inputValue == '') {
            document.querySelector('#errorDisplay').style.display = 'block';
            var time = setTimeout(showError, 2000);
            throw new Error('Please enter some text!');
        } else {
            //Predicting duplication
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
            }
            try {
                if (tasks.indexOf(inputValue) != -1) {
                    document.querySelector('#errorDisplay').style.display = 'block';
                    //Hide error message in 2 sec, reload document, cancel changings
                    var timeout = setTimeout(showError, 2000);
                    throw new Error('This task already exists!!!');
                } else {
                    //Changing list textContent to the input value
                    elem = inputValue;

                    //Passing changes into local storage
                    passChangesToLocalStorageAfterRename(text, inputValue, cancelRename);

                }
            }
            catch (error) {
                document.querySelector('#errorDisplay h2').innerHTML = error.message;
            }
        }
    }
    catch (error) {
        document.querySelector('#errorDisplay h2').innerHTML = error.message;
    }



    e.preventDefault();
}


function showError() {
    //Hiding error msg
    document.querySelector('#errorDisplay').style.display = 'none';

    //Cancelling all the actions on the list
    return;
}






//Passing rename value to the local storage
function passChangesToLocalStorageAfterRename(oldText, newText, callback) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }


    /* If there is coincidence in the values - change the */
    /* 'tasks' array and pass it back to local storage */
    tasks.forEach(function (task, index) {
        if (oldText == task) {
            tasks.splice(index, 1, newText);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });

    //Callback function to hide rename block
    callback();

}

//Hiding rename form
function cancelRename(e) {
    inputContainer.style.display = 'none';

    location.reload();
    e.preventDefault();
}


//Remove item from list
function removeTask(e) {

    //Check whether 'a' element has 'deleteItem' class and if yes - remove list item 
    if (e.target.parentElement.classList.contains('deleteItem')) {
        let node = e.target.parentElement.parentElement;
        node.remove();

        removeFromLocalStorage(node);
    }
}

//Remove from local storage
function removeFromLocalStorage(node) {

    //Regular if statement to create 'tasks' variable
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    //applying method forEach and removing item task name from local storage if there is coincidence
    tasks.forEach(function (task, index) {
        let checkContent = node.textContent;
        if (checkContent == task) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    })
}



//Filter the tasks
function filterTasks(e) {

    //Convert input value to LowerCase
    let inputValue = e.target.value.toLowerCase();

    //Getting array of items and apply forEach method to display those list that have coincidence
    document.querySelectorAll('.listItem').forEach(function (list) {
        if (list.firstChild.textContent.toLowerCase().indexOf(inputValue) != -1) {
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
        }
    })

}

//Clear the list
function clearList(e) {
    if (confirm('Are you sure you want to delete all tasks?')) {

        //Removing child of parent element until none exist
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
        clearLocalStorage();

    }

    //Preventing default behaviour of 'a' element
    e.preventDefault();
}

//Clear the local Storage
function clearLocalStorage() {
    localStorage.removeItem('tasks');
    inputContainer.style.display = 'none';
    input.value = '';
        location.reload();
}