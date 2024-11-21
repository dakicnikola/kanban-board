import './App.css'
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.tsx";
import {TKanbanColumnProps} from "./components/KanbanBoard/KanbanColumn/KanbanColumn.tsx";
import {v4 as uuid} from 'uuid';

function App() {

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
  return (
    <>
      <KanbanBoard columns={kanbanBoardColumns} />
    </>
  )
}

export default App
