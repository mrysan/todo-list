import TodoListItem from './TodoListItem.jsx';
import styles from './TodoList.module.css';
import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => {
    if (!todo.isCompleted) {
      return todo;
    }
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
  const totalPages = Math.ceil(
    Object.keys(filteredTodoList).length / itemsPerPage
  );
  const navigate = useNavigate();

  // redirect to home page if invalid page # is entered
  useEffect(() => {
    // only fire once pages are loaded
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > currentPage) {
        setSearchParams(1);
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate, setSearchParams]);

  const handlePreviousPage = () => {
    setSearchParams(`?page=${currentPage - 1}`);
  };

  const handleNextPage = () => {
    setSearchParams(`?page=${currentPage + 1}`);
  };

  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : filteredTodoList.length === 0 ? (
        <p>Add a todo above to get started</p>
      ) : (
        <ul className={styles.itemList}>
          {filteredTodoList
            .slice(indexOfFirstTodo, indexOfLastTodo)
            .map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
        </ul>
      )}

      <div className={styles.paginationControls}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.navButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.navButton}
        >
          Next
        </button>
      </div>
    </>
  );
}
export default TodoList;
