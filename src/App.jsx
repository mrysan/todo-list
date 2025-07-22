import './App.css';
import TodoList from './todolist.jsx';
import ToDoForm from './ToDoForm.jsx';

function App() {
  return (
    <div>
      <h1>Todo List</h1>
      <ToDoForm />
      <TodoList />
    </div>
  );
}

export default App;
