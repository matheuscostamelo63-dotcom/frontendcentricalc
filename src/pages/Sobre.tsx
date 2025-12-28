import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Droplet, Settings, TrendingUp } from "lucide-react";

const Sobre = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sobre o CentriCalc
        </h1>
        <p className="text-muted-foreground">
          Sistema de Dimensionamento de Bombas Centrífugas
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              O CentriCalc é um sistema desenvolvido para apoiar engenheiros e técnicos no dimensionamento preciso de sistemas de bombeamento centrífugo. A ferramenta automatiza cálculos hidráulicos complexos, integrando múltiplos parâmetros e diferentes condições operacionais, o que reduz erros, economiza tempo e aumenta a confiabilidade dos resultados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Cálculos Precisos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dimensionamento completo considerando perdas de carga,
                    cavitação e eficiência do sistema.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Múltiplos Fluidos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Suporte para diferentes tipos de fluidos com propriedades
                    personalizáveis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Configuração Flexível
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Definição detalhada de trechos de tubulação, materiais e
                    acessórios.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Relatórios Completos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Geração de relatórios PDF com gráficos e análise detalhada dos
                    resultados.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como Usar o CentriCalc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-foreground">
                    <strong>Informações do Projeto:</strong> Preencha o nome do
                    projeto, responsável e parâmetros básicos como vazão e NPSHr.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-foreground">
                    <strong>Parâmetros do Fluido:</strong> Configure as
                    propriedades do fluido (densidade, viscosidade, temperatura).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-foreground">
                    <strong>Sistema de Sucção:</strong> Defina o tipo de
                    reservatório, níveis e características da tubulação de sucção.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-foreground">
                    <strong>Sistemas de Recalque:</strong> Configure um ou mais
                    destinos de recalque com suas respectivas tubulações.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="text-foreground">
                    <strong>Calcular:</strong> Clique no botão "Calcular" para
                    processar os dados e visualizar os resultados.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sobre;