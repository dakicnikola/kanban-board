import {createContext, ReactNode, useContext} from "react";
import {TKanbanColumnProps} from "../components/KanbanBoard/KanbanColumn/KanbanColumn.tsx";
import {v4 as uuid} from "uuid";

function KanbanContextProvider({children}: IKanbanContextProviderProps) {

  const createCard = (columnId: string, cardLabel: string) => {
    console.log({columnId, cardLabel});
  }
  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    console.log({fromColumnId, toColumnId, cardId});
  }
  const removeCard = (columnId: string, cardId: string) => {
    console.log({columnId, cardId});
  }


  return (
    <KanbanContext.Provider
      value={{createCard, moveCard, removeCard, columns: kanbanBoardColumns}}
    >
      {children}
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
  createCard: (columnId: string, cardLabel: string) => void;
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
  removeCard: (columnId: string, cardId: string) => void
  columns: TKanbanColumnProps[]
}

export type {IKanbanContextValue}
export {useKanbanContext, KanbanContextProvider}


const kanbanBoardColumns: TKanbanColumnProps[] = [
  {
    name: 'To Do',
    color: 'blue',
    items: [
      {label: 'Review request for proposal', id: uuid()},
      {label: 'Develop BIM model of wind shear impact', id: uuid()}
    ]
  },
  {
    name: 'In Progress', color: 'red',
    items: [
      {label: 'Prepare for client meeting with Addisons', id: uuid()},
      {label: 'Addison client meeting Thursday 11 a.m.', id: uuid()},
      {label: 'Write speech on housing trends', id: uuid()},
      {label: 'Speak to realtors dinner Wed 7 p.m.', id: uuid()}
    ]
  },
  {
    name: 'Done', color: 'black',
    items: [
      {label: 'Write meeting minutes from client meeting', id: uuid()}
    ]
  },
]
