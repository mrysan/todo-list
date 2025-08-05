import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList }) {
  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo.title} />
      ))}
    </ul>
  );
}
export default TodoList;
