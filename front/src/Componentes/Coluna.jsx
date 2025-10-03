import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tarefa } from './Tarefa';

export function Coluna({ titulo, tarefas = [] }) {
  return (
    <section className="coluna">
      <h2>{titulo}</h2>
      <Droppable droppableId={titulo}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="lista-tarefas"
          >
            {tarefas.map((tarefa, index) => (
              <Draggable
                key={tarefa.id.toString()}
                draggableId={tarefa.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Tarefa tarefa={tarefa} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
