'use server';

import { revalidatePath } from "next/cache";
import { addTodo, toggleTodo } from "@/lib/todos";

export async function addTodoAction(formData: FormData) {
  const title = formData.get("title");
  if (typeof title !== "string") {
    return { error: "Invalid title" };
  }

  const result = await addTodo(title);
  revalidatePath("/");
  return result;
}

export async function toggleTodoAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") {
    return { error: "Invalid todo id" };
  }

  const result = await toggleTodo(id);
  revalidatePath("/");
  return result;
}
