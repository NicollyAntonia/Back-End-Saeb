import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Tarefa({ tarefa, onTarefaAtualizada, onTarefaExcluida }) {
    const navigate = useNavigate();
    const [novoStatus, setNovoStatus] = useState(tarefa.status);
    const [mensagem, setMensagem] = useState(""); // para erros ou sucesso
    const [erro, setErro] = useState(false); // flag de erro

    async function excluirTarefa(id) {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tarefas/${id}/`);
                setMensagem("Tarefa excluída com sucesso!");
                setErro(false);
                if (onTarefaExcluida) onTarefaExcluida(id); // callback opcional
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
                setMensagem("Erro ao excluir tarefa.");
                setErro(true);
            }
        }
    }

    async function alterarStatus(e) {
        e.preventDefault();

        if (!novoStatus) {
            setMensagem("Selecione um status válido antes de alterar.");
            setErro(true);
            return;
        }

        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`,
                { status: novoStatus }
            );

            setMensagem("Status alterado com sucesso!");
            setErro(false);
            setNovoStatus(response.data.status);

            if (onTarefaAtualizada) onTarefaAtualizada(response.data); // callback opcional
        } catch (error) {
            console.error("Erro ao alterar status:", error.response?.data || error);
            const msg = error.response?.data?.status?.[0] || "Erro ao alterar status.";
            setMensagem(msg);
            setErro(true);
        }
    }

    return (
        <article className="tarefa">
            <header>
                <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>
            </header>

            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.setor}</dd>
                <dt>Prioridade:</dt>
                <dd>{tarefa.prioridade}</dd>
            </dl>

            <div className="tarefa__acoes">
                <button type="button" onClick={() => navigate(`/editar/${tarefa.id}`)}>
                    Editar
                </button>

                <button type="button" aria-label="Excluir tarefa" onClick={() => excluirTarefa(tarefa.id)}>
                    Excluir
                </button>
            </div>

            <form className="tarefa__status" onSubmit={alterarStatus}>
                <label htmlFor={`status-${tarefa.id}`}>Status:</label>
                <select
                    id={`status-${tarefa.id}`}
                    name="status"
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value)}
                >
                    <option value="">Selecione</option>
                    <option value="A fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>
                </select>
                <button type="submit">Alterar Status</button>
            </form>

            {mensagem && (
                <p style={{ color: erro ? "red" : "green", marginTop: "0.5rem" }}>
                    {mensagem}
                </p>
            )}
        </article>
    );
}
