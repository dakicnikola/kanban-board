import {CSS} from '@dnd-kit/utilities';
import {useSortable} from "@dnd-kit/sortable";

type TKanbanCardProps = {
  id: string;
  columnId: string
  label?: string,
  onDoubleClick?: () => void;
  onDelete?: () => void;
  index: number
}


const KanbanCard = (props: TKanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    active
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const classNames = ["kanban-column-item"]
  if (active?.id === props.id) {
    classNames.push("active");
  }

  return (
    <div
      ref={setNodeRef}
      className={classNames.join(" ")}
      onDoubleClick={props.onDoubleClick}
      style={style}
      {...listeners}
      {...attributes}
    >
      <p>{props.label}</p>
      <div className={"kanban-column-item-delete-button"}>
        <button onClick={props.onDelete}>
          x
        </button>
      </div>
    </div>
  );
};

export default KanbanCard;
