"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function Board() {
    const getBoard = useBoardStore((state) => state.getBoard);

    useEffect(() => {
        getBoard();
    }, [getBoard]);

    return (
        <h1>Hello</h1>
        // <DragDropContext>
        //     <Droppable
        //         droppableId="board"
        //         direction="horizontal"
        //         type="columns"
        //     >
        //         {(provided) => <div>{/* rendering all the columns */}</div>}
        //     </Droppable>
        // </DragDropContext>
    );
}
export default Board;