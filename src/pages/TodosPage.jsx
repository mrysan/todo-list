import TodoList from '../features/TodoList/TodoList.jsx';
import TodoForm from '../features/TodoForm.jsx';
import TodosViewForm from '../features/TodosViewForm.jsx';
import styles from '../App.module.css';

function TodosPage({
  todoState,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
  completeTodo,
  updateTodo,
  addTodo,
  clearErrorMessage,
  currentPage,
  totalPages,
}) {
  return (
    <>
      <div className={styles.todoComponents}>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
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
    </>
  );
}

export default TodosPage;
