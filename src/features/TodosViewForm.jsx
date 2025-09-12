function TodosViewForm() {
  return (
    <>
      <label>Sort By</label>
      <select>
        <option value="title">Title</option>
        <option value="createdTime">Time Added</option>
      </select>

      <label>Direction</label>
      <select>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </>
  );
}

export default TodosViewForm;
