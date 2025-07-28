import TodoListItem from './TodoListItem.jsx';

function TodoList() {
  const todos = [
    { id: 1, title: 'review resource' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' },
  ];
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} item={{ id: todo.id, title: todo.title }} />
      ))}
    </ul>
  );
}
export default TodoList;
