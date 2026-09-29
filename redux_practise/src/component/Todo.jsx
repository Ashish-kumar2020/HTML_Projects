import {useSelector} from "react-redux"

function Todo(){

    const todos = useSelector((state) => state.todoReducer.todo );

    return (
        <>
            <h1>Todo</h1>
            {
                todos.map((todo) => {
                    return <div key={todo.id}>
                        <span>{todo.task}</span>
                    </div>
                })
            }
        </>
    )
}

export default Todo;