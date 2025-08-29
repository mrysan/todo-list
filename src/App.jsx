import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo, // has to be newTodo because its a string
            isCompleted: false, // false because its a brand new todo - it can't be anything else
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw Error(resp.status);
      }
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.log(error.toString());
      setErrorMessage(error.toString());
    } finally {
      setIsSaving(false);
    }
  };

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
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

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
