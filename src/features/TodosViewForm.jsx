import { useEffect, useState } from 'react';

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
      <form onSubmit={preventRefresh}>
        <div>
          <label>Search Todos</label>
          <input
            type="text"
            value={localQueryString}
            onChange={(event) => {
              setLocalQueryString(event.target.value);
            }}
          ></input>
          <button
            type="button"
            onClick={() => {
              setLocalQueryString('');
            }}
          >
            Clear
          </button>
        </div>

        <div>
          <label>Sort By</label>
          <select
            value={sortField}
            onChange={(event) => {
              setSortField(event.target.value);
            }}
          >
            <option value="createdTime">Time Added</option>
            <option value="title">Title</option>
          </select>

          <label>Direction</label>
          <select
            value={sortDirection}
            onChange={(event) => {
              setSortDirection(event.target.value);
            }}
          >
            <option value="asc">Ascending</option>
            <option value={'desc'}>Descending</option>
          </select>
        </div>
      </form>
    </>
  );
}

export default TodosViewForm;
