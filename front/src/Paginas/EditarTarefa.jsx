import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Schema de validação
const schemaEditarTarefa = z.object({
  prioridade: z.enum(["Baixa", "Media", "Alta"], {
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" }),
  }),
  status: z.enum(["A fazer", "Fazendo", "Pronto"], {
    errorMap: () => ({ message: "Escolha um status válido" }),
  }),
});

export function EditarTarefa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaEditarTarefa),
  });

  const prioridades = ["Baixa", "Media", "Alta"];
  const statusOptions = ["A fazer", "Fazendo", "Pronto"];

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/tarefas/${id}/`)
      .then((res) => {
        setTarefa(res.data);
        reset({
          prioridade: res.data.prioridade,
          status: res.data.status,
        });
      })
      .catch((err) => console.error("Erro ao buscar tarefa:", err));
  }, [id, reset]);

  async function salvarEdicao(data) {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefas/${id}/`, data);
      alert("Tarefa atualizada com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err.response?.data || err);
      alert("Erro ao atualizar tarefa");
    }
  }

  if (!tarefa) return <p>Carregando...</p>;

  return (
    <section className="formulario" aria-labelledby="editar-tarefa-title">
      <h2 id="editar-tarefa-title">Editar Tarefa</h2>
      <form onSubmit={handleSubmit(salvarEdicao)} noValidate>
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          value={tarefa.descricao}
          readOnly
          aria-readonly="true"
        />

        <label htmlFor="setor">Setor:</label>
        <input
          id="setor"
          type="text"
          value={tarefa.setor}
          readOnly
          aria-readonly="true"
        />

        <label htmlFor="usuario">Usuário:</label>
        <input
          id="usuario"
          type="text"
          value={tarefa.usuario?.nome || ""}
          readOnly
          aria-readonly="true"
        />

        <label htmlFor="dt_cadastro">Data de Cadastro:</label>
        <input
          id="dt_cadastro"
          type="text"
          value={tarefa.dt_cadastro}
          readOnly
          aria-readonly="true"
        />

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          {...register("prioridade")}
          aria-invalid={errors.prioridade ? "true" : "false"}
          aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
        >
          <option value="">Selecione</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>
              {p === "Media" ? "Média" : p}
            </option>
          ))}
        </select>
        {errors.prioridade && (
          <p id="prioridade-error" className="error">
            {errors.prioridade.message}
          </p>
        )}

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          {...register("status")}
          aria-invalid={errors.status ? "true" : "false"}
          aria-describedby={errors.status ? "status-error" : undefined}
        >
          <option value="">Selecione</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.status && (
          <p id="status-error" className="error">
            {errors.status.message}
          </p>
        )}

        <button type="submit">Editar</button>
      </form>
    </section>
  );
}
