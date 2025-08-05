import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    // prevents page from refreshing when user clicks add todo btn
    event.preventDefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">toDo</label>
      <input
        type="text"
        id="todoTitlte"
        name="title"
        ref={todoTitleInput}
      ></input>
      <button type="submit">Add ToDo</button>
    </form>
  );
}

export default TodoForm;
