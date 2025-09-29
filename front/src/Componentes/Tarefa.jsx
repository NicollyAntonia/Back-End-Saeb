import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Tarefa({ tarefa }) {
    const navigate = useNavigate();
    const [novoStatus, setNovoStatus] = useState(tarefa.status); 
    async function excluirTarefa(id) {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/tarefa/${id}/`);
                alert("Tarefa excluída com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
                alert("Erro ao excluir tarefa.");
            }
        }
    }

    async function alterarStatus(e) {
        e.preventDefault(); 
        try {
            await axios.patch(`http://127.0.0.1:8000/tarefa/${tarefa.id}/`, {
                status: novoStatus,
            });
            alert("Status alterado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error.response?.data || error);
            alert("Erro ao alterar status.");
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
                <label>Status:</label>
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
        </article>
    );
}
