import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsloading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          console.log(resp);
          throw Error(resp.status); // resp.message does not exist
        }
        const response = await resp.json();
        const records = response.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!record.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(records);
      } catch (error) {
        setErrorMessage(error.toString());
      } finally {
        setIsloading(false);
      }
    };
    fetchTodos();
  }, []); // useEffect

  function addTodo(title) {
    const newTodo = { title: title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }

  function dismissErrorMessage() {
    setErrorMessage('');
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage.length > 0 ? (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={dismissErrorMessage}>
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
