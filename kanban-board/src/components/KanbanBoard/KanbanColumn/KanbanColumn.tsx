import "./kanban-column.scss"
import {useKanbanContext} from "../../../contexts/KanbanBoardContext.tsx";
import KanbanCard from "./KanbanCard/KanbanCard.tsx";
import {useDroppable} from "@dnd-kit/core";

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

  const {setNodeRef} = useDroppable({id: props.id})


  return (
    <div className={["kanban-column-container", props.color].join(" ")} data-testid="column">
      <div className={"kanban-column-header"} data-testid="column-header">
        <div className={"kanban-column-header-title"}>
          <h3>
            {props.name}
          </h3>
        </div>
        <div className={"kanban-column-header-subtitle"}>
          <p data-testid="number-of-items">
            {formatNumberOfTasksText(props.items?.length)}
          </p>
        </div>
        <div className={"kanban-column-header-action-button"}>
          <button onClick={onCreateNewCard} name={"add item"}>+</button>
        </div>
      </div>
      <div className={"kanban-column-body"} ref={setNodeRef} data-testid="column-body">
        {props.items?.map((item, cardIndex) => (
          <KanbanCard
            key={item.id}
            onDoubleClick={onCardDoubleClick(item.id, item.label)}
            onDelete={deleteTicket(props.id, item.id)}
            label={item.label}
            id={item.id}
            index={cardIndex}
            columnId={props.id}
          />
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
