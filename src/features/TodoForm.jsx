import { useRef, useState } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    // prevents page from refreshing when user clicks add todo btn
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">toDo</label>
      <input
        value={workingTodoTitle}
        type="text"
        id="todoTitlte"
        name="title"
        ref={todoTitleInput}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
      ></input>
      <button type="submit" disabled={workingTodoTitle === ''}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
