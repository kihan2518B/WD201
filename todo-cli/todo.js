const todoList = () => {
  let dateToday = new Date()
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const tommorow = new Date(today)
  tommorow.setDate(today.getDate() + 1)
  const all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    // Write the date check condition here and return the array
    return all.filter((item) => item.dueDate === yesterday)
    // of overdue items accordingly.
  }

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    return all.filter((item) => item.dueDate === today)
  }

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    return all.filter((item) => new Date(item.dueDate) > new Date())
  }

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    return list
      .map((item) => {
        const status = item.completed ? "[x]" : "[ ]"
        const dueDate = item.dueDate === today ? "" : `${item.dueDate}`
        return `${status} ${item.title} ${dueDate}`
      })
      .join("\n")
  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  }
}
module.exports = todoList
