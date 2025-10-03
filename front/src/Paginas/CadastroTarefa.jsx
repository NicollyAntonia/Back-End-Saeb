import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";

const schemaCadTarefa = z.object({
  descricao: z.string().min(1).max(300),
  setor: z.string().min(1).max(250),
  prioridade: z.enum(["Baixa", "Media", "Alta"]),
  usuario: z.string().min(1),
  status: z.enum(["A fazer", "Fazendo", "Pronto"]).optional()
});

export function CadastroTarefa({ onTarefaCadastrada }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schemaCadTarefa)
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/usuarios/")
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  async function onSubmit(data) {
    const payload = {
      descricao: data.descricao,
      setor: data.setor,
      prioridade: data.prioridade,
      usuario: parseInt(data.usuario),
      status: data.status || "A fazer"
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/tarefas/", payload);
      setMensagem("Tarefa cadastrada com sucesso!");
      setErro(false);
      reset();
      if (onTarefaCadastrada) onTarefaCadastrada(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data?.status?.[0] || "Erro ao cadastrar tarefa";
      setMensagem(msg);
      setErro(true);
    }
  }

  return (
    <section className="formulario">
      <h2>Cadastro de Tarefa</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Descrição:</label>
        <textarea {...register("descricao")} rows={4} />
        {errors.descricao && <p className="erro">{errors.descricao.message}</p>}

        <label>Setor:</label>
        <input type="text" {...register("setor")} />
        {errors.setor && <p className="erro">{errors.setor.message}</p>}

        <label>Prioridade:</label>
        <select {...register("prioridade")} defaultValue="">
          <option value="" disabled>Selecione</option>
          <option value="Baixa">Baixa</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        {errors.prioridade && <p className="erro">{errors.prioridade.message}</p>}

        <label>Usuário:</label>
        <select {...register("usuario")} defaultValue="">
          <option value="" disabled>Selecione</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
        {errors.usuario && <p className="erro">{errors.usuario.message}</p>}

        <label>Status:</label>
        <select {...register("status")} defaultValue="A fazer">
          <option value="A fazer">A fazer</option>
          <option value="Fazendo">Fazendo</option>
          <option value="Pronto">Pronto</option>
        </select>

        <button type="submit">Cadastrar</button>
        {mensagem && <p className={erro ? "erro" : "sucesso"}>{mensagem}</p>}
      </form>
    </section>
  );
}
