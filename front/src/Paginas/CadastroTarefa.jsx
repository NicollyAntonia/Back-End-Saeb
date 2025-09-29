import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";

// Schema de validação com regex
const schemaCadTarefa = z.object({
  descricao: z.string()
    .min(1, "Informe uma descrição")
    .max(100, "Informe no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9\s.,-]*$/, "Descrição contém caracteres inválidos (apenas letras, números, espaços, pontos, vírgulas e traços)"),
  
  setor: z.string()
    .min(1, "Informe um setor")
    .max(50, "Informe no máximo 50 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "Setor só pode conter letras e espaços"),

  // Prioridade validada via enum (string exata)
  prioridade: z.enum(["Baixa", "Media", "Alta"], {
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" })
  }),

  usuario: z.string()
    .min(1, "Selecione um usuário")
});

export function CadastroTarefa() {
  const [usuarios, setUsuarios] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadTarefa)
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/usuarios/")
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Erro ao buscar usuários:", err));
  }, []);

  async function obterDados(data) {
    const usuarioId = parseInt(data.usuario);
    const hoje = new Date().toISOString().split("T")[0];

    // Ajuste no status para bater com backend ('P' para Pendente)
    const payload = {
      descricao: data.descricao,
      setor: data.setor,
      prioridade: data.prioridade, // enviando string, ajusta backend ou converta aqui
      usuario: usuarioId,
      dt_cadastro: hoje,
      status: 'P' // status padrão para 'Pendente'
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/tarefas/", payload);
      alert("Tarefa cadastrada com sucesso!");
      reset();
    } catch (err) {
      console.error("Erro ao cadastrar tarefa:", err.response?.data || err);
      alert("Erro ao cadastrar tarefa");
    }
  }

  return (
    <section className="formulario" aria-labelledby="titulo-form">
      <h2 id="titulo-form">Cadastro de Tarefa</h2>
      <form onSubmit={handleSubmit(obterDados)} noValidate>

        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          {...register("descricao")}
          aria-invalid={errors.descricao ? "true" : "false"}
          aria-describedby={errors.descricao ? "descricao-error" : undefined}
          aria-label="Descrição da tarefa"
          rows={4}
        />
        {errors.descricao && (
          <p id="descricao-error" role="alert" style={{color: "red"}}>
            {errors.descricao.message}
          </p>
        )}

        <label htmlFor="setor">Setor:</label>
        <input
          type="text"
          id="setor"
          {...register("setor")}
          aria-invalid={errors.setor ? "true" : "false"}
          aria-describedby={errors.setor ? "setor-error" : undefined}
          aria-label="Setor responsável"
        />
        {errors.setor && (
          <p id="setor-error" role="alert" style={{color: "red"}}>
            {errors.setor.message}
          </p>
        )}

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          {...register("prioridade")}
          aria-invalid={errors.prioridade ? "true" : "false"}
          aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
          aria-label="Prioridade da tarefa"
          defaultValue=""
        >
          <option value="" disabled>Selecione</option>
          <option value="Baixa">Baixa</option>
          <option value="Media">Média</option>
          <option value="Alta">Alta</option>
        </select>
        {errors.prioridade && (
          <p id="prioridade-error" role="alert" style={{color: "red"}}>
            {errors.prioridade.message}
          </p>
        )}

        <label htmlFor="usuario">Usuário:</label>
        <select
          id="usuario"
          {...register("usuario")}
          aria-invalid={errors.usuario ? "true" : "false"}
          aria-describedby={errors.usuario ? "usuario-error" : undefined}
          aria-label="Usuário responsável"
          defaultValue=""
        >
          <option value="" disabled>Selecione um usuário</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
        {errors.usuario && (
          <p id="usuario-error" role="alert" style={{color: "red"}}>
            {errors.usuario.message}
          </p>
        )}

        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
