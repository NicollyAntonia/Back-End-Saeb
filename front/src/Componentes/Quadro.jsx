import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coluna } from './Coluna';

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        const apiUrl = 'http://127.0.0.1:8000/api/tarefas/';

        axios.get(apiUrl)
            .then(response => setTarefas(response.data))
            .catch(error => console.error("Erro ao buscar tarefas:", error));
    }, []);

    // Filtragem correta
    const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === 'A fazer'); 
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo'); 
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'Pronto');  

    return (
        <main className="conteiner">
            <section className="atividades">
                <Coluna titulo="A fazer" tarefas={tarefasAFazer} />
                <Coluna titulo="Fazendo" tarefas={tarefasFazendo} />
                <Coluna titulo="Pronto" tarefas={tarefasPronto} />
            </section>
        </main>
    );
}
