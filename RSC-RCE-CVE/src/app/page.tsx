import { addTodoAction, toggleTodoAction } from "./actions";
import { getTodos } from "@/lib/todos";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Idea 1 - RSC + Server Actions
          </span>
          <h1 className="text-4xl font-semibold leading-tight">
            Todo list that re-renders on the server with every action
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            The page is a Server Component. Todos are read from an in-memory
            store, and every add/toggle call is a Server Action that
            revalidates this route so the UI refreshes without a full reload.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
          <form
            action={addTodoAction}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="title"
              required
              placeholder="Add a new todo..."
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/15"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              + Add todo
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {todos.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
                No todos yet. Add something and watch the server render update
                instantly.
              </p>
            ) : (
              todos.map((todo) => (
                <article
                  key={todo.id}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/25 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full transition ${
                        todo.completed
                          ? "bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.18)]"
                          : "bg-slate-500"
                      }`}
                      aria-hidden
                    />
                    <div>
                      <p
                        className={`text-base font-medium ${
                          todo.completed
                            ? "text-slate-400 line-through decoration-slate-500"
                            : "text-white"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(todo.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <form action={toggleTodoAction} className="shrink-0">
                    <input type="hidden" name="id" value={todo.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {todo.completed ? "Mark as undone" : "Mark done"}
                    </button>
                  </form>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
