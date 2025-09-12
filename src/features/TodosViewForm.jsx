function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
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
            value={queryString}
            onChange={(event) => {
              setQueryString(event.target.value);
            }}
          ></input>
          <button
            type="button"
            onClick={() => {
              setQueryString('');
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
