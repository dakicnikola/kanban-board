import './kanban-board.scss'
import KanbanColumn, {TKanbanColumnProps} from "../KanbanColumn/KanbanColumn.tsx";

type TKanbanBoardProps = {
  columns: TKanbanColumnProps[];
}
const KanbanBoard = (props: TKanbanBoardProps) => {
  return (
    <div className="kanban-board">

      {props.columns.map((column, idx) => (
        <KanbanColumn {...column} key={`${column.name}-${idx}`} />
      ))}
    </div>
  );
};

export default KanbanBoard;
