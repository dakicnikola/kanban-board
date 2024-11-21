import './kanban-board.scss'
import KanbanColumn from "./KanbanColumn/KanbanColumn.tsx";
import {useKanbanContext} from "../../contexts/KanbanBoardContext.tsx";

const KanbanBoard = () => {

  const {columns} = useKanbanContext()

  return (
    <div className="kanban-board">

      {columns.map((column, idx) => (
        <KanbanColumn {...column} key={`${column.name}-${idx}`} />
      ))}
    </div>
  );
};

export default KanbanBoard;
