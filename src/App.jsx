import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import { useState, useEffect, useCallback } from 'react';
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('asc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let searchQuery = `${queryString}`;
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (searchQuery) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsloading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw Error(resp.status); // resp.message does not exist
        }
        const response = await resp.json();
        const records = response.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!record.fields.isCompleted) {
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
  }, [sortField, sortDirection, queryString]); // useEffect

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
      const resp = await fetch(encodeUrl(), options);
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

  const completeTodo = async (id) => {
    // update Locally FIRST - optimistic approach
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);

    // find todo that was completed by id
    const originalTodo = todoList.find((todo) => todo.id === id);
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw Error(resp.status);
      }
    } catch (error) {
      console.log(error.toString());
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = [...todoList, originalTodo];
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    // update locally FIRST - optimistic approach
    const updatedTodos = todoList.map((todo) => {
      if (todo.id == editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });
    setTodoList(updatedTodos);

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw Error(resp.status);
      }
    } catch (error) {
      console.log(error.toString());
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = [...todoList, originalTodo];
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  function dismissErrorMessage() {
    setErrorMessage('');
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <h1>Todo List</h1>
      </div>
      <div class={styles.todoComponents}>
        <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
        />

        {errorMessage.length > 0 ? (
          <div className={styles.error}>
            <p>{errorMessage}</p>
            <button type="button" onClick={dismissErrorMessage}>
              Dismiss
            </button>
          </div>
        ) : null}

        <hr />
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </div>
    </div>
  );
}

export default App;
