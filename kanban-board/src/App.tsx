import './App.css'
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.tsx";
import {KanbanContextProvider} from "./contexts/KanbanBoardContext.tsx";

function App() {


  return (
    <>
      <KanbanContextProvider>
        <KanbanBoard />
      </KanbanContextProvider>
    </>
  )
}

export default App
