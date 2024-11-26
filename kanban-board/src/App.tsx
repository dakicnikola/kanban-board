import './App.css'
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.tsx";
import {KanbanContextProvider} from "./contexts/KanbanBoardContext.tsx";
import {ErrorBoundary} from "react-error-boundary";

function App() {


  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <KanbanContextProvider>
        <KanbanBoard />
      </KanbanContextProvider>
    </ErrorBoundary>
  )
}

export default App
