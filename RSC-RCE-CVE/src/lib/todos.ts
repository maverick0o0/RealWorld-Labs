export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const todos: Todo[] = [
  {
    id: crypto.randomUUID(),
    title: "Ship the first RSC render",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: crypto.randomUUID(),
    title: "Wire up a Server Action",
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

export async function getTodos(): Promise<Todo[]> {
  return todos
    .slice()
    .sort(
      (a, b) =>
        Number(a.completed) - Number(b.completed) ||
        b.createdAt - a.createdAt
    );
}

export async function addTodo(title: string) {
  const trimmed = title.trim();
  if (!trimmed) {
    return { error: "Title is required." };
  }

  todos.unshift({
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: Date.now(),
  });

  return { success: true };
}

export async function toggleTodo(id: string) {
  const todo = todos.find((item) => item.id === id);
  if (!todo) {
    return { error: "Todo not found." };
  }

  todo.completed = !todo.completed;
  return { success: true };
}
