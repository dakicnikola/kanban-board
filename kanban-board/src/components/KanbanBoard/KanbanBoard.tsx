import './kanban-board.scss'
import KanbanColumn from "./KanbanColumn/KanbanColumn.tsx";
import {useKanbanContext} from "../../contexts/KanbanBoardContext.tsx";
import {ChangeEvent, useState} from "react";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import type {DragStartEvent} from "@dnd-kit/core/dist/types";

const KanbanBoard = () => {

  const {columns, searchTerm, setSearchTerm, moveCard} = useKanbanContext()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onFilterChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value)
  }

  const [draggingCard, setDraggingCard] = useState<{ color?: string, label?: string }>({})


  return (
    <div className={"kanban-board-container"}>
      <div className={"kanban-board-search"}>
        <label htmlFor="search">Search</label>
        <input type="text" name="search" value={searchTerm} onChange={onFilterChange} />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="kanban-board">
          {columns.map((column) => (
            <SortableContext
              items={column.items.map(({id}) => id)}
              strategy={verticalListSortingStrategy}
              key={column.id}
              id={column.id}
            >
              <KanbanColumn {...column} />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {draggingCard.label && draggingCard.color ? (
            <div className={["kanban-column-item", "dragging", draggingCard.color].join(" ")}>
              <p>{draggingCard.label}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <button onClick={() => {
        window.localStorage.removeItem("columns")
        window.location.reload()
      }}>
        Clear columns cache and refresh
      </button>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    const columnId = event.active.data.current?.sortable.containerId
    const cardId = `${event.active.id}`
    const column = columns
      .find(({id}) => id === columnId)
    const label = column?.items.find(({id}) => id === cardId)?.label;

    setDraggingCard({
      label,
      color: column?.color
    });
  }


  function handleDragOver(event: DragOverEvent) {
    const {active, over} = event;
    const id = String(active.id)
    const overId = String(over?.id)

    moveCard(id, overId);
  }

};

export default KanbanBoard;
