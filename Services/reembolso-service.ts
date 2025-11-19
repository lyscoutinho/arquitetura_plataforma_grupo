import { Reembolso, CriarReembolsoDTO } from "@/Types/reembolso";

// Simulação de Banco de Dados(enquanto ainda estou sem acesso á API)
let MOCK_DB: Reembolso[] = [
  { id: "R001", nomeFuncionario: "João Silva", categoria: "Combustível", descricao: "Viagem cliente ABC", valor: 120.00, data: "10/06/2025", status: "Pendente" },
  { id: "R002", nomeFuncionario: "Maria Santos", categoria: "Alimentação", descricao: "Almoço com cliente XYZ", valor: 85.50, data: "09/06/2025", status: "Aprovado" },
  { id: "R003", nomeFuncionario: "Pedro Costa", categoria: "Material", descricao: "Materiais de escritório", valor: 245.30, data: "08/06/2025", status: "Pendente" },
  { id: "R004", nomeFuncionario: "Ana Oliveira", categoria: "Transporte", descricao: "Uber para reunião", valor: 32.50, data: "07/06/2025", status: "Rejeitado" },
  { id: "R005", nomeFuncionario: "Carlos Mendes", categoria: "Hospedagem", descricao: "Hotel viagem negócios", valor: 450.00, data: "06/06/2025", status: "Aprovado" },
];

export const ReembolsoService = {
  // Simula um GET na API com delay de 1 segundo
  listarTodos: async (): Promise<Reembolso[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_DB]), 800);
    });
  },

  // Simula um POST na API (por enquanto)
  criar: async (dados: CriarReembolsoDTO): Promise<Reembolso> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoItem: Reembolso = {
          id: `R${Math.floor(Math.random() * 9999)}`, // Gera ID aleatório
          nomeFuncionario: "Usuário Atual", // Simula o usuário logado
          status: "Pendente",
          ...dados,
        };
        MOCK_DB = [novoItem, ...MOCK_DB];
        resolve(novoItem);
      }, 1000);
    });
  },

  // Simula um PUT/PATCH (aprovar/rejeitar)
  atualizarStatus: async (id: string, status: 'Aprovado' | 'Rejeitado'): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_DB = MOCK_DB.map(item => 
          item.id === id ? { ...item, status } : item
        );
        resolve();
      }, 500);
    });
  }
};