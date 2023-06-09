import './TodosContainer.css'
import TodoForm from './TodoForm'
import TodoCard from '../TodoCard/TodoCard'

const TodosContainer = ({todos}) => {
    return (
        <div className="general-task-container">
            <TodoForm />
            {
                todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo}/>
                ))
            }

            
        </div>
    )
}

export default TodosContainer
