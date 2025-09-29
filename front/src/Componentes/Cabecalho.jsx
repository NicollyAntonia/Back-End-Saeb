import { BarraNavegacao } from './BarraNavegacao' // ajuste o caminho se necessário

export function Cabecalho() {
  return (
    <>
      <header className="cabecalho">
        <h1>Gerenciamento de Tarefas</h1>
      </header>
      <nav className="barra">
          <BarraNavegacao />
      </nav>
    </>
  )
}
