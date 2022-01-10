class TodoList {
  constructor(el) {
    this.todos = [];
    this.el = el;
    this.el.addEventListener('click', (event) => {
      this.todoEventHandler(event);
    });
  }

  todoEventHandler(event) {
    let target = event.target;
    let todoId = target.closest('li').dataset.id;

    if (target.className.includes('delete-task')) {
      this.removeTodo(todoId);
    } else if (target.className.includes('set-status')) {
      this.changeStatus(todoId);
    }
  }

  addTodo(todo) {
    this.todos.push(todo);
    this.render();
  }

  removeTodo(id) {
    this.todos = this.todos.filter((el) => {
      return el.id !== id;
    });

    let todoToRemove = document.querySelector(`[data-id="${id}"]`);
    todoToRemove.remove();
  }

  getTodos() {
    return this.todos;
  }

  setTodos(todos) {
    this.todos = todos;
  }

  changeStatus(id) {
    let index = this.todos.findIndex((el) => el.id === id);
    let todoToChangeStatus = document.querySelector(`[data-id="${id}"]`);

    this.todos[index].status = !this.todos[index].status;
    this.changeTodoColor(todoToChangeStatus);
  }

  changeTodoColor(el) {
    el.classList.toggle('done');
  }

  findTodos(data) {
    let currentTodos = this.getTodos();
    this.todos = this.todos.filter((todo) => todo.value.includes(data));
    this.render();
    this.setTodos(currentTodos);
  }

  render() {
    let list = '';
    for (let el of this.todos) {
      if (!el) {
        return;
      }
      list += `<li class="list-item must-done ${el.status ? 'done' : 'must-done'}" data-id="${
        el.id
      }">${el.value}
      <button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
    }
    this.el.innerHTML = list;
  }
}

class Task {
  constructor(value, status) {
    this.value = value;
    this.status = status;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

let list = document.getElementById('list');
let todo1 = new TodoList(list);
todo1.addTodo(new Task('Сделать зарядку', false));
todo1.addTodo(new Task('Купить хлебушка', false));
todo1.addTodo(new Task('Выполнить ДЗ!!!', false));
todo1.render();

const input = document.querySelector('.todo-input');
const createButton = document.querySelector('#create-todo');
const findButton = document.querySelector('#find-todo');

createButton.addEventListener('click', () => {
  if (input.value) {
    todo1.addTodo(new Task(input.value), false);
  }
  input.value = '';
});

findButton.addEventListener('click', () => {
  if (input.value) {
    todo1.findTodos(input.value);
  }
});
