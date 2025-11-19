export type StatusReembolso = 'Pendente' | 'Aprovado' | 'Rejeitado';

export interface Reembolso {
  id: string;
  nomeFuncionario: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  status: StatusReembolso;
  justificativa?: string;
}

// Dados necessários para criar um novo reembolso
export interface CriarReembolsoDTO {
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  justificativa?: string;
  anexos?: string[];
}