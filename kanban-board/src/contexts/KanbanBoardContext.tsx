import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {TKanbanColumnProps} from "../components/KanbanBoard/KanbanColumn/KanbanColumn.tsx";
import {v4 as uuid} from "uuid";
import CardContentDialog from "../components/KanbanBoard/CardContentDialog/CardContentDialog.tsx";
import {arrayMove} from "@dnd-kit/sortable";

function KanbanContextProvider({children}: IKanbanContextProviderProps) {

  const [columns, setColumns] = useState<TKanbanColumnProps[]>(() => {
    const columnsFromLocalStorage = window.localStorage.getItem("columns");
    //todo add validation for columnsFromLocalStorage
    return columnsFromLocalStorage ? JSON.parse(columnsFromLocalStorage) : kanbanBoardColumns
  })

  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [editCardState, setEditCardState] = useState<{
    cardId?: string,
    label?: string,
    columnId?: string
    open: boolean,
  }>({
    open: false
  })


  function findContainerId(targetId: string) {
    return findContainer(targetId)?.id
  }

  function findContainer(targetId: string) {
    const column = columns.find(({id}) => targetId === id)
    if (column) {
      return column
    }
    return columns.find(({items}) => items.map(({id}) => id).includes(targetId))
  }

  const moveCard = (activeCardId: string, overCardId: string) => {
    // Find the containers
    const activeContainerId = findContainerId(activeCardId);
    const overContainerId = findContainerId(overCardId);

    if (
      !activeContainerId ||
      !overContainerId
    ) {
      return;
    }
    if (activeContainerId === overContainerId) {
      const activeItems = columns.find(({id}) => id === activeContainerId)!.items;
      const overItems = columns.find(({id}) => id === overContainerId)!.items;

      const activeIndex = activeItems.findIndex(({id}) => id === activeCardId);
      const overIndex = overItems.findIndex(({id}) => id === overCardId);

      if (activeIndex !== overIndex) {
        setColumns((prev) => prev.map(
            col => col.id === overContainerId ? ({...col, items: arrayMove(col.items, activeIndex, overIndex)}) : col
          )
        )
      }

      setDraggingCardId(null);

    } else {
      setColumns((prev) => {
        const activeItems = prev.find(({id}) => id === activeContainerId)!.items;
        const overItems = prev.find(({id}) => id === overContainerId)!.items;

        // Find the indexes for the items
        const activeIndex = activeItems.findIndex(({id}) => id === activeCardId);
        const overIndex = overItems.findIndex(({id}) => id === overCardId);

        let newIndex;
        if (overCardId === overContainerId) {
          // We're at the root droppable of a container
          newIndex = overItems.length + 1;
        } else {
          const isBelowLastItem = true
          // over &&
          // overIndex === overItems.length - 1 &&
          // draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

          const modifier = isBelowLastItem ? 1 : 0;

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        const activeCard = activeItems[activeIndex]!

        return prev.map((prevCol) => {
          if (activeContainerId === prevCol.id) {
            return {...prevCol, items: prevCol.items.filter(({id}) => id !== activeCardId)}
          } else if (overContainerId === prevCol.id) {
            return {
              ...prevCol,
              items: [...prevCol.items.slice(0, newIndex), activeCard, ...prevCol.items.slice(newIndex, prevCol.items.length)]
            }
          } else {
            return prevCol
          }
        })
      });
    }

  }
  const removeCard = (columnId: string, cardId: string) => {
    setColumns(prevState =>
      prevState.map(col => col.id !== columnId ? col : {
        ...col,
        items: col.items.filter(item => item.id !== cardId)
      })
    )
  }

  const openCardContentModal = (columnId: string, cardId?: string, label?: string) => {
    setEditCardState({columnId, cardId, label, open: true})
  }


  const filteredColumns = useMemo(() => {
    if (!searchTerm.length) {
      return columns
    } else {
      const loweredSearchTerm = searchTerm.toLowerCase();
      return columns.map(
        column => ({
          ...column,
          items: column.items.filter(({label}) => label.toLowerCase().includes(loweredSearchTerm),),
        })
      )
    }
  }, [columns, searchTerm]);

  const closeCreateEditModal = () => {
    setEditCardState(prevState => ({...prevState, open: false}))
  }

  const handleCardContentChangeSave = (label: string) => {
    const isEditing = Boolean(editCardState.cardId)
    if (isEditing) {
      setColumns(prevState => prevState.map(
        col => col.id !== editCardState.columnId ? col :
          {...col, items: col.items.map(item => item.id === editCardState.cardId ? {...item, label} : item,)}
      ))
    } else {
      const newItem = {label, id: uuid()}
      setColumns(prevState => prevState.map(
        col => col.id !== editCardState.columnId ? col :
          {...col, items: [...col.items, newItem]}
      ))
    }
    setEditCardState(prevState => ({...prevState, open: false}))
  }


  useEffect(() => {
    window.localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);


  return (
    <KanbanContext.Provider
      value={{
        openCardContentModal,
        moveCard,
        removeCard,
        columns: filteredColumns,
        searchTerm,
        setSearchTerm,
        draggingCardId
      }}
    >
      {children}
      <CardContentDialog visible={editCardState.open}
                         onClose={closeCreateEditModal}
                         label={editCardState.label}
                         title={editCardState.cardId ? "Edit card content" : "Create new card"}
                         onSave={handleCardContentChangeSave}
      />
    </KanbanContext.Provider>
  )
}

const KanbanContext = createContext<IKanbanContextValue | null>(null);

const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanbanContext called outside of a provider');
  }
  return context;
};


interface IKanbanContextProviderProps {
  children: ReactNode
}

interface IKanbanContextValue {
  moveCard: (activeCardId: string, overCardId: string) => void;
  removeCard: (columnId: string, cardId: string) => void
  columns: TKanbanColumnProps[],
  searchTerm: string,
  setSearchTerm: (searchTerm: string) => void
  openCardContentModal: (columnId: string, cardId?: string, label?: string) => void
  draggingCardId: string | null
}

export type {IKanbanContextValue}
export {useKanbanContext, KanbanContextProvider}


const kanbanBoardColumns: TKanbanColumnProps[] = [
  {
    name: 'To Do', color: 'blue', id: uuid(),
    items: [
      {label: 'Review request for proposal', id: uuid()},
      {label: 'Develop BIM model of wind shear impact', id: uuid()}
    ]
  },
  {
    name: 'In Progress', color: 'red', id: uuid(),
    items: [
      {label: 'Prepare for client meeting with Addisons', id: uuid()},
      {label: 'Addison client meeting Thursday 11 a.m.', id: uuid()},
      {label: 'Write speech on housing trends', id: uuid()},
      {label: 'Speak to realtors dinner Wed 7 p.m.', id: uuid()}
    ]
  },
  {
    name: 'Done', color: 'black', id: uuid(),
    items: [
      {label: 'Write meeting minutes from client meeting', id: uuid()}
    ]
  },
]
