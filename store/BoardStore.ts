import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, Column, Todo, TypedColumn } from "@/typings";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    newTaskType: TypedColumn;
    newTaskInput: string;

    image: File | null;
    setNewTaskInput: (input: string) => void;

    searchString: string;
    setSearchString: (searchString: string) => void;

    setNewTaskType: (columnId: TypedColumn) => void;
    setImage: (image: File | null) => void;

    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    searchString: "",
    newTaskInput: "",
    newTaskType: "todo",
    image: null,
    setSearchString: (searchString) => set({ searchString }),
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board) => {
        set({ board });
    },
    setImage: (image: File | null) => {
        set({ image });
    },
    deleteTask: async (taskIndex, todo, id) => {
        const newColumns = new Map(get().board.columns);

        // delete todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
            todo.$id
        );
    },

    setNewTaskInput: (input) => set({ newTaskInput: input }),
    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        );
    },
}));
