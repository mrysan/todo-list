import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form``;
const StyledInput = styled.input`
  width: 100%;
`;
const StyledButtom = styled.button``;
const StyledLabel = styled.label`
  font-size: 20px;
`;
const StyledOption = styled.option``;
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin-bottom: 10px;
`;
const StyledSelect = styled.select`
  width: 115px;
  text-align: center;
  margin-right: 5px;
  margin-left: 5px;
  font-size: 16px;
  border-radius: 5px;
`;

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      // if a user types, it cancels the existing 500ms timeout
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  function preventRefresh(event) {
    event.preventDefault();
  }

  return (
    <>
      <StyledForm onSubmit={preventRefresh}>
        <StyledDiv>
          <StyledLabel>Search:</StyledLabel>
          <StyledInput
            type="text"
            value={localQueryString}
            onChange={(event) => {
              setLocalQueryString(event.target.value);
            }}
          ></StyledInput>
          <StyledButtom
            type="button"
            onClick={() => {
              setLocalQueryString('');
            }}
          >
            Clear
          </StyledButtom>
        </StyledDiv>

        {/* Sort By and Direction Drop Downs */}
        <StyledDiv>
          <StyledLabel>Sort By</StyledLabel>
          <StyledSelect
            value={sortField}
            onChange={(event) => {
              setSortField(event.target.value);
            }}
          >
            <StyledOption value="createdTime">Time Added</StyledOption>

            <StyledOption value="title">Title</StyledOption>
          </StyledSelect>

          <StyledLabel>Direction</StyledLabel>
          <StyledSelect
            value={sortDirection}
            onChange={(event) => {
              setSortDirection(event.target.value);
            }}
          >
            <StyledOption value="asc">Ascending</StyledOption>
            <StyledOption value={'desc'}>Descending</StyledOption>
          </StyledSelect>
        </StyledDiv>
      </StyledForm>
    </>
  );
}

export default TodosViewForm;
