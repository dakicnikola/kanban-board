import './kanban-board.scss'
import KanbanColumn from "./KanbanColumn/KanbanColumn.tsx";
import {useKanbanContext} from "../../contexts/KanbanBoardContext.tsx";
import {ChangeEvent} from "react";

const KanbanBoard = () => {

  const {columns, searchTerm, setSearchTerm} = useKanbanContext()

  const onFilterChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value)
  }


  return (
    <div className={"kanban-board-container"}>
      <div className={"kanban-board-search"}>
        <label htmlFor="search">Search</label>
        <input type="text" name="search" value={searchTerm} onChange={onFilterChange} />
      </div>
      <div className="kanban-board">
        {columns.map((column) => (
          <KanbanColumn {...column} key={column.id} />
        ))}
      </div>
      <button onClick={() => {
        window.localStorage.removeItem("columns")
        window.location.reload()
      }}>
        Clear columns cache and refresh
      </button>
    </div>
  );
};

export default KanbanBoard;
