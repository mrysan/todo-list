import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import { useState, useEffect, useCallback, useReducer } from 'react';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
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
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw Error(`${resp.status} ${resp.statusText}`);
        }
        const response = await resp.json();

        dispatch({ type: todoActions.loadTodos, records: response.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error });
      } finally {
        dispatch({ type: todoActions.endRequest });
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
      dispatch({ type: todoActions.startRequest });

      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw Error(`${resp.status} ${resp.statusText}`);
      }

      const { records } = await resp.json();

      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error: error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    dispatch({ type: todoActions.completeTodo, id: id });

    // find todo that was completed by id
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
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
      dispatch({ type: todoActions.startRequest });

      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw Error(`${resp.status} ${resp.statusText}`);
      }
    } catch (error) {
      // revert to orignal todo if it fails to update via API
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
        error: error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });

    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
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
      dispatch({ type: todoActions.startRequest });

      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw Error(`${resp.status} ${resp.statusText}`);
      }
    } catch (error) {
      // revert to orignal todo if it fails to update via API
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
        error: error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const clearErrorMessage = () => {
    dispatch({ type: todoActions.clearError });
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <img src="./public/favicon.svg" alt="todo-icon" />
        <h1>Todo List</h1>
      </div>
      <div className={styles.todoComponents}>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />

        {todoState.errorMessage.length > 0 ? (
          <div className={styles.error}>
            <p>{todoState.errorMessage}</p>
            <button type="button" onClick={clearErrorMessage}>
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
