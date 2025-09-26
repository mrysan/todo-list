import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';
const StyledForm = styled.form`
  justify-content: space-between;
  display: flex;
  align-items: center;
  align-content: center;
`;
const StyledButton = styled.button`
  &:disabled {
    background-color: #ff6b6b82;
    font-style: italic;
    cursor: not-allowed;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
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
    <>
      <StyledForm onSubmit={handleAddTodo}>
        <TextInputWithLabel
          ref={todoTitleInput}
          value={workingTodoTitle}
          onChange={(event) => {
            setWorkingTodoTitle(event.target.value);
          }}
          elementId="todoTitle"
          labelText="Todo:"
        />
        <StyledButton type="submit" disabled={workingTodoTitle.trim() === ''}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </StyledButton>
      </StyledForm>
    </>
  );
}

export default TodoForm;
