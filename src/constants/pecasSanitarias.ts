export interface PecaSanitaria {
  tipo: string;
  nome: string;
  peso: number;
}

export const PECAS_SANITARIAS: PecaSanitaria[] = [
  { tipo: "bacia_caixa_acoplada", nome: "Bacia c/ Caixa Acoplada", peso: 0.3 },
  { tipo: "bacia_valvula", nome: "Bacia c/ Válvula de Descarga", peso: 32.0 },
  { tipo: "banheira", nome: "Banheira", peso: 1.0 },
  { tipo: "bebedouro", nome: "Bebedouro", peso: 0.1 },
  { tipo: "bide", nome: "Bidê", peso: 0.1 },
  { tipo: "chuveiro", nome: "Chuveiro", peso: 0.5 },
  { tipo: "chuveiro_eletrico", nome: "Chuveiro Elétrico", peso: 0.1 },
  { tipo: "lavadora_pratos", nome: "Máquina de Lavar Pratos", peso: 1.0 },
  { tipo: "lavadora_roupas", nome: "Máquina de Lavar Roupas", peso: 1.0 },
  { tipo: "lavatorio", nome: "Lavatório", peso: 0.3 },
  { tipo: "micturio_valvula", nome: "Mictório c/ Válvula", peso: 2.5 },
  { tipo: "micturio_caixa_descarga", nome: "Mictório c/ Caixa Descarga", peso: 0.3 },
  { tipo: "pia_cozinha", nome: "Pia de Cozinha", peso: 0.7 },
  { tipo: "tanque_roupas", nome: "Tanque de Roupas", peso: 0.7 },
  { tipo: "torneira_jardim", nome: "Torneira de Jardim", peso: 0.5 }
];