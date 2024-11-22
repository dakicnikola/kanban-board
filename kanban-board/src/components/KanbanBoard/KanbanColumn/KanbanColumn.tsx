import "./kanban-column.scss"
import {useKanbanContext} from "../../../contexts/KanbanBoardContext.tsx";

const KanbanColumn = (props: TKanbanColumnProps) => {

  const {removeCard, openCardContentModal} = useKanbanContext()

  const deleteTicket = (columnId: string, cardId: string) => () => {
    removeCard(columnId, cardId)
  }


  const onCardDoubleClick = (cardId: string, label: string) => () => {
    openCardContentModal(props.id, cardId, label)
  }
  const onCreateNewCard = () => {
    openCardContentModal(props.id)
  }

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
          <button onClick={onCreateNewCard}>+</button>
        </div>
      </div>
      <div className={"kanban-column-body"}>
        {props.items?.map((item) => (
          <div className={"kanban-column-item"} key={item.id}
               onDoubleClick={onCardDoubleClick(item.id, item.label)}
          >
            <p>{item.label}</p>
            <div className={"kanban-column-item-delete-button"}>
              <button onClick={deleteTicket(props.id, item.id)}>
                x
              </button>
            </div>
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
  id: string;
  items: TBoardItem[]
}

type TBoardItem = {
  label: string;
  id: string;
}

export default KanbanColumn;

export type {TKanbanColumnProps, TBoardItem}
