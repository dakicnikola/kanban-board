import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {TKanbanColumnProps} from "../components/KanbanBoard/KanbanColumn/KanbanColumn.tsx";
import {v4 as uuid} from "uuid";
import CardContentDialog from "../components/KanbanBoard/CardContentDialog/CardContentDialog.tsx";

function KanbanContextProvider({children}: IKanbanContextProviderProps) {

  const [columns, setColumns] = useState<TKanbanColumnProps[]>(() => {
    const columnsFromLocalStorage = window.localStorage.getItem("columns");
    //todo add validation for columnsFromLocalStorage
    return columnsFromLocalStorage ? JSON.parse(columnsFromLocalStorage) : kanbanBoardColumns
  })

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [editCardState, setEditCardState] = useState<{
    cardId?: string,
    label?: string,
    columnId?: string
    open: boolean,
  }>({
    open: false
  })


  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    console.log({fromColumnId, toColumnId, cardId});
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
      value={{openCardContentModal, moveCard, removeCard, columns: filteredColumns, searchTerm, setSearchTerm,}}
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
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
  removeCard: (columnId: string, cardId: string) => void
  columns: TKanbanColumnProps[],
  searchTerm: string,
  setSearchTerm: (searchTerm: string) => void
  openCardContentModal: (columnId: string, cardId?: string, label?: string) => void
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
