import "./kanban-column.scss"

const KanbanColumn = (props: TKanbanColumnProps) => {
  return (
    <div className={["kanban-column-container", props.color].join(" ")}>
      <div className={"kanban-column-header"}>
        <div className={"kanban-column-header-title"}>
          <h3>
            {props.name}
          </h3>
        </div>
        <div className={"kanban-column-header-subtitle"}>
          {formatNumberOfTasksText(props.items?.length)}
        </div>
        <div className={"kanban-column-header-action-button"}>
          <button>+</button>
        </div>
      </div>
      <div className={"kanban-column-body"}>
        {props.items?.map((item) => (
          <div className={"kanban-column-item"} key={item.id}>
            {item.label}
          </div>
        ))}
      </div>

    </div>
  );
};

const formatNumberOfTasksText = (numberOfTasks: number | undefined) => `(${numberOfTasks || 0})`

type TKanbanColumnProps = {
  name: string;
  color: 'blue' | 'red' | 'black';
  items?: TBoardItem[]
}

type TBoardItem = {
  label: string;
  id: string;
}

export default KanbanColumn;

export type {TKanbanColumnProps}
