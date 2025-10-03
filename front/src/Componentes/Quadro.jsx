import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coluna } from './Coluna';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        const apiUrl = 'http://127.0.0.1:8000/api/tarefas/';

        axios.get(apiUrl)
            .then(response => setTarefas(response.data))
            .catch(error => console.error("Erro ao buscar tarefas:", error));
    }, []);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // Se não mudou de coluna, não faz nada
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        const tarefaMovida = tarefas.find(tarefa => tarefa.id.toString() === draggableId);
        const novasTarefas = tarefas.map(tarefa =>
            tarefa.id === tarefaMovida.id
                ? { ...tarefa, status: destination.droppableId }
                : tarefa
        );

        setTarefas(novasTarefas);

        // Atualiza no backend (opcional)
        axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefaMovida.id}/`, {
            status: destination.droppableId
        }).catch(error => console.error("Erro ao atualizar status:", error));
    };

    const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === 'A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'Pronto');

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <main className="conteiner">
                <section className="atividades">
                    <Coluna titulo="A fazer" tarefas={tarefasAFazer} />
                    <Coluna titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna titulo="Pronto" tarefas={tarefasPronto} />
                </section>
            </main>
        </DragDropContext>
    );
}
