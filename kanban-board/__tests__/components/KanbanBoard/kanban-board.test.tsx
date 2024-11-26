import {describe, expect, test} from 'vitest'
import {fireEvent, getByRole, getByTestId, getByText, render, screen, waitFor} from '@testing-library/react'
import KanbanBoard from "../../../src/components/KanbanBoard/KanbanBoard";
import {KanbanContextProvider} from "../../../src/contexts/KanbanBoardContext";

describe('KanbanBoard tests', () => {
  describe('KanbanBoard context', () => {
    test('KanbanBoard will return error if called outside context', () => {
      expect(() => render(<KanbanBoard />)).toThrow("useKanbanContext called outside of a provider");
    })
    test('KanbanBoard will not throw error inside context', () => {
      expect(() => render(
        <KanbanContextProvider>
          <KanbanBoard />
        </KanbanContextProvider>
      )).not.toThrowError()
    })
  })
  describe('KanbanBoard', () => {
    test('correct title will be rendered', () => {
      expect(render(
        <KanbanContextProvider><KanbanBoard /></KanbanContextProvider>).getByRole('heading', {level: 1}).innerHTML)
        .toMatch("Kanban Board")
    })
    test('search input will be rendered with label', () => {
      expect(render(
        <KanbanContextProvider><KanbanBoard /></KanbanContextProvider>).getByLabelText("Search")).toBeVisible()
    })
    test('columns will be rendered properly', () => {
      render(<KanbanContextProvider><KanbanBoard /></KanbanContextProvider>)
      const columns = screen.getAllByTestId("column")
      expect(columns.length).toEqual(3)
      columns.forEach(column => {
        expect(getByTestId(column, "column-header")).toBeDefined()
      })
      columns.forEach(column => {
        expect(getByTestId(column, "column-body")).toBeDefined()
      })
      columns.forEach(column => {
        expect(getByTestId(column, "column-body")).toBeDefined()
      })
    })
    test('number of cards will match number in header, properly formatted', () => {
      render(<KanbanContextProvider><KanbanBoard /></KanbanContextProvider>)
      const columns = screen.getAllByTestId("column")
      columns.forEach(column => {
        const columnBody = getByTestId(column, "column-body")
        const displayedNumberOfTickets = getByTestId(column, "number-of-items")
        expect(displayedNumberOfTickets.innerHTML).toEqual(`(${columnBody.children.length})`)
      })
    })
    test('add button will open create card modal, and close button will close it', async () => {
      render(<KanbanContextProvider><KanbanBoard /></KanbanContextProvider>)
      const firstColumn = screen.getAllByTestId("column")[0]
      expect(getByText(firstColumn, '+')).toBeDefined()
      const addTicketButton = getByText(firstColumn, '+')
      expect(getComputedStyle(screen.getByTestId("card-content-title").parentElement.parentElement).display).toBe("none")
      fireEvent.click(addTicketButton)
      await waitFor(() =>
        expect(getComputedStyle(screen.getByText("Create new card").parentElement.parentElement).display).toBe("block")
      )
      const closeModalButton = screen.getByRole('button', {name: "Close"})
      fireEvent.click(closeModalButton)

      await waitFor(() => {
          return expect(getComputedStyle(screen.getByTestId("card-content-title").parentElement.parentElement).display).toBe("none")
        }
      )
    })
    test('creating new card will add the card to column body', async () => {
      render(<KanbanContextProvider><KanbanBoard /></KanbanContextProvider>)
      const firstColumn = screen.getAllByTestId("column")[0]
      expect(getByText(firstColumn, '+')).toBeDefined()
      const addTicketButton = getByText(firstColumn, '+')
      fireEvent(
        addTicketButton,
        new MouseEvent('click', {bubbles: true, cancelable: true}),
      )
      await waitFor(() =>
        expect(getComputedStyle(screen.getByText("Create new card").parentElement.parentElement).display).toBe("block")
      )
      const textArea = screen.getByLabelText("Card label")
      fireEvent.change(textArea, {target: {value: 'New card'}})
      const saveCardButton = screen.getByText('Save')
      fireEvent.click(
        saveCardButton,
      )

      const columnBody = getByTestId(firstColumn, "column-body")
      expect(getByText(columnBody, "New card")).toBeVisible()

      await waitFor(() =>
          expect(getComputedStyle(screen.getByTestId("card-content-title").parentElement.parentElement).display).toBe("none"),
        {timeout: 2000}
      )

    })
    test("Editing card will change it's content", async () => {
      render(<KanbanContextProvider><KanbanBoard /></KanbanContextProvider>)
      const firstColumn = screen.getAllByTestId("column")[0]
      const columnBody = getByTestId(firstColumn, "column-body")
      const firstCard = columnBody.firstChild
      const firstCardText = getByRole(columnBody.firstChild, "paragraph").innerHTML

      fireEvent.click(firstCard)
      expect(getComputedStyle(screen.getByTestId("card-content-title").parentElement.parentElement).display).toBe("none")
      fireEvent.dblClick(firstCard)
      await waitFor(() =>
        expect(getComputedStyle(screen.getByText("Edit card content").parentElement.parentElement).display).toBe("block")
      )
      const textArea = screen.getByLabelText("Card label")
      expect(textArea.innerHTML).toBe(firstCardText)
      fireEvent.change(textArea, {target: {value: 'New card'}})
      expect(textArea.innerHTML).toBe("New card")
      const saveCardButton = screen.getByText('Save')
      fireEvent.click(saveCardButton)
      waitFor(() =>
        expect(getComputedStyle(screen.getByLabelText("Card label").parentElement.parentElement).display).toBe("none")
      )
      expect(getByRole(columnBody.firstChild, "paragraph").innerHTML).toBe("New card")
    })
  })
})


