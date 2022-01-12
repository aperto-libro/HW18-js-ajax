const input = document.querySelector('.todo-input');
const createButton = document.querySelector('#create-todo');
let list = document.getElementById('list');

const requestURL = 'http://localhost:3000/todos';

function getJSON(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open('get', url, true);

    xhr.responseType = 'json'; // ответ будет в виде обьекта, а не строка

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };

    xhr.send();
  });
}

const postJSON = function (url, data) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.responseType = 'json';

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 201) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };

    xhr.onerror = function (e) {
      reject('Error fetching ' + url);
    };

    xhr.send(JSON.stringify(data));
  });
};

const putJSON = function (url, data) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open('put', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.responseType = 'json';

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };

    xhr.onerror = function (e) {
      reject('Error fetching ' + url);
    };

    xhr.send(JSON.stringify(data));
  });
};

const deleteJSON = function (url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open('delete', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.responseType = 'json';

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function (e) {
      reject('Error fetching ' + url);
    };

    xhr.send(null);
  });
};

class TodoList {
  constructor(elem) {
    this.elem = elem;
    this.elem.addEventListener('click', (event) => {
      let target = event.target;
      let todoId = target.closest('li').dataset.id;

      if (target.className.includes('set-status')) {
        newTodo.changeTodoStatus(todoId);
      } else if (target.className.includes('delete-task')) {
        newTodo.removeTodo(todoId);
      }
    });
  }

  async getDataFromDB() {
    try {
      let data = await getJSON(requestURL);
      return data;
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async addTodo() {
    try {
      if (input.value !== '') {
        await postJSON(requestURL, {
          task: input.value,
          complited: false,
        });
        this.render();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changeTodoStatus(id) {
    try {
      let data = await getJSON(requestURL);

      for (let item of data) {
        if (item.id == id) {
          item.complited = !item.complited;
          let todoToChangeStatus = document.querySelector(`[data-id="${id}"]`);

          this.changeTodoColor(todoToChangeStatus);

          putJSON(`${requestURL}/${id}`, {
            task: item.task,
            complited: item.complited,
          });
        }
      }
    } catch (error) {
      console.log(new Error(error));
    }
  }

  changeTodoColor(el) {
    el.classList.toggle('done');
  }

  async removeTodo(id) {
    try {
      let data = await getJSON(requestURL);

      for (let item of data) {
        if (item.id == id) {
          deleteJSON(`${requestURL}/${id}`);
        }
        this.render();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async render() {
    let res = '';

    try {
      let data = await this.getDataFromDB();

      for (let el of data) {
        if (!el) {
          return;
        }
        res += `<li class="list-item must-done ${el.complited ? 'done' : 'must-done'}" data-id="${
          el.id
        }">${el.task}
          <button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
      }
      this.elem.innerHTML = res;
    } catch (error) {
      console.log(new Error(error));
    }
  }
}

let newTodo = new TodoList(list);
newTodo.render();

createButton.addEventListener('click', function () {
  newTodo.addTodo();
  input.value = '';
});
