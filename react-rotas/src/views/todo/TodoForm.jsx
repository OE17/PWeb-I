import React from 'react'
import Grid from '../template/Grid'
import IconButton from '../template/IconButton'

const TodoForm = props => (
    <div role='form' className='todoForm'>
        <div className='col-xs-12 col-sm-9 col-md-10'>
            <Grid cols='12 9 10'>
                <input id='description' className='form-control' 
                    placeholder='Adicione uma tarefa'
                    onChange={props.handleChange}
                    value={props.description}
                    ></input>
            </Grid>
        </div>

        <Grid cols='12 3 2'>
            <IconButton 
                btnStyle='success' 
                icon='plus'
                onClick={props.handleAdd}
                title='Adicionar Tarefa'
            />
        </Grid>
    </div>
)

export default TodoForm