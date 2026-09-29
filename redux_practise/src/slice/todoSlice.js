import { createSlice } from "@reduxjs/toolkit";



const todoSlice = createSlice({
    name: "todo",
    initialState: {
        todo: [
            {
                id: Date.now(),
                task: "Hello",
                complete: false
            }
        ]
    },
    reducers: {
        addTodo: (state,action) => {
            state.todo.push({
                id: Date.now(),
                task: action.payload,
                complete: false
            })
        }
    }
});

export const {addTodo} = todoSlice.actions;
export default todoSlice.reducer; 