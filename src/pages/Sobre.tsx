import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  CheckCircle,
  Database,
  Droplet,
  FileText,
  Info,
  XCircle,
} from "lucide-react";

// ─── Seção genérica ───────────────────────────────────────────────────────────
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// ─── Bloco de alerta ──────────────────────────────────────────────────────────
const AlertaItem = ({
  nivel,
  titulo,
  norma,
  item,
  descricao,
}: {
  nivel: "CRITICO" | "ATENCAO" | "IMPEDITIVO";
  titulo: string;
  norma: string;
  item: string;
  descricao: string;
}) => {
  const colors: Record<string, string> = {
    CRITICO:
      "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    ATENCAO:
      "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
    IMPEDITIVO:
      "border-red-500 bg-red-100 dark:border-red-700 dark:bg-red-950/50",
  };
  const badges: Record<string, string> = {
    CRITICO: "bg-red-100 text-red-800 border-red-300",
    ATENCAO: "bg-yellow-100 text-yellow-800 border-yellow-300",
    IMPEDITIVO: "bg-red-200 text-red-900 border-red-500",
  };
  const icons: Record<string, React.ReactNode> = {
    CRITICO: <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />,
    ATENCAO: <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />,
    IMPEDITIVO: <XCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />,
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[nivel]}`}>
      <div className="flex items-start gap-3">
        {icons[nivel]}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{titulo}</span>
            <Badge variant="outline" className={`text-xs ${badges[nivel]}`}>
              {nivel}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {norma} · {item}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{descricao}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Tabela simples ───────────────────────────────────────────────────────────
const Tabela = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <div className="overflow-x-auto rounded-md border">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-muted/60">
          {headers.map((h) => (
            <th
              key={h}
              className="px-4 py-2 text-left font-semibold text-foreground border-b"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 border-b last:border-b-0">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Sobre = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Documentação Técnica — CentriCalc
        </h1>
        <p className="text-muted-foreground">
          Sistema de Dimensionamento de Bombas Centrífugas · v1.0.0
        </p>
      </div>

      <div className="space-y-8">
        {/* ── 1. Visão Geral ─────────────────────────────────────────────── */}
        <Section icon={<Info className="h-5 w-5 text-primary" />} title="Visão Geral">
          <p className="text-foreground leading-relaxed">
            O <strong>CentriCalc</strong> é uma ferramenta de engenharia desenvolvida
            para automatizar o dimensionamento de sistemas de bombeamento centrífugo em
            instalações prediais e industriais. O sistema realiza cálculos hidráulicos
            rigorosos baseados nas normas técnicas brasileiras (ABNT), cobrindo desde a
            determinação da vazão de projeto até a seleção do motor elétrico e a análise
            de cavitação.
          </p>
          <p className="text-foreground leading-relaxed mt-3">
            Os resultados gerados têm caráter de{" "}
            <strong>estimativa técnica de engenharia</strong> e não substituem o
            julgamento profissional de um engenheiro habilitado responsável pelo projeto.
            Consulte a seção <em>Responsabilidades</em> ao final desta documentação.
          </p>
        </Section>

        {/* ── 2. Metodologias de Cálculo ─────────────────────────────────── */}
        <Section
          icon={<Calculator className="h-5 w-5 text-primary" />}
          title="Metodologias de Cálculo"
        >
          <div className="space-y-8">
            {/* 2.1 Vazão */}
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                2.1 Determinação da Vazão de Projeto
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Dois métodos são suportados, selecionáveis conforme o tipo de sistema:
              </p>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">
                    Método dos Pesos (NBR 5626 / NBR 8160)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Aplicável a sistemas prediais de água fria e esgoto. Cada peça
                    sanitária possui um "peso" (unidade de descarga) tabelado pela norma.
                    A vazão de projeto é calculada pela fórmula de Hunter:
                  </p>
                  <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                    Q = 0,3 × raiz(P){"   "}— água fria (Q em L/s, P = somatório dos pesos)
                    <br />
                    Q = 0,5 × raiz(P){"   "}— esgoto sanitário
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    Base normativa: <strong>NBR 5626:2020</strong> (água fria predial) e{" "}
                    <strong>NBR 8160:1999</strong> (esgoto sanitário).
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">Vazão Manual</p>
                  <p className="text-sm text-muted-foreground">
                    O responsável técnico informa diretamente a vazão de projeto em m³/h,
                    adequado para sistemas industriais ou quando a vazão é determinada por
                    processo ou medição.
                  </p>
                </div>
              </div>
            </div>

            {/* 2.2 Velocidade e Regime de Escoamento */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.2 Velocidade e Regime de Escoamento
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                A velocidade média é calculada pela equação da continuidade e o regime
                pelo número de Reynolds:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono mb-3">
                V = Q / A{"   "}(A = pi × D² / 4)
                <br />
                Re = rho × V × D / mu
              </code>
              <Tabela
                headers={["Condição", "Regime", "Tratamento"]}
                rows={[
                  ["Re < 2.000", "Laminar", "f = 64 / Re"],
                  ["Re ≥ 2.000", "Turbulento", "Equação de Swamee-Jain (Colebrook simplificado)"],
                ]}
              />
            </div>

            {/* 2.3 Fator de Atrito */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.3 Fator de Atrito — Equação de Swamee-Jain
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Para regime turbulento, o fator de Darcy-Weisbach é obtido pela
                aproximação explícita de Swamee-Jain, evitando iteração:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                1/raiz(f) = -2 × log10( e/(3,7×D) + 5,74/Re^0,9 )
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Onde <em>e</em> é a rugosidade absoluta do material (mm), obtida do banco
                de dados interno com 17 materiais cadastrados.
              </p>
            </div>

            {/* 2.4 Perdas de Carga */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.4 Perdas de Carga
              </h3>
              <div className="space-y-3">
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">
                    Perda Distribuída — Darcy-Weisbach
                  </p>
                  <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                    hf = f × (L/D) × V² / (2g)
                  </code>
                </div>
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">
                    Perda Localizada — Método K
                  </p>
                  <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                    hl = K × V² / (2g)
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    O coeficiente K é obtido do banco de dados com 18 conexões
                    catalogadas (cotovelos, tês, válvulas, entradas/saídas). O usuário
                    também pode informar K diretamente.
                  </p>
                </div>
              </div>
            </div>

            {/* 2.5 Altura Manométrica Total */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.5 Altura Manométrica Total (HMT)
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                A HMT é calculada para o <strong>pior caso operacional</strong> —
                nível mínimo de sucção e nível máximo de recalque — garantindo que a
                bomba selecionada atenda às condições mais desfavoráveis:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono mb-2">
                HMT = (P_recalque - P_sucção) / (rho × g) + (z_rec_max - z_suc_min) + hf_suc + hl_suc + hf_rec + hl_rec
              </code>
              <p className="text-sm text-muted-foreground">
                O sistema suporta múltiplos trechos de sucção e múltiplos destinos de
                recalque. Para cada combinação suc-×-rec é calculada uma HMT e o
                valor máximo global é utilizado para dimensionamento.
              </p>
            </div>

            {/* 2.6 NPSH */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.6 Análise de Cavitação — NPSH Disponível
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                O NPSHa é calculado para o nível mínimo de sucção, condição mais
                crítica para cavitação:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono mb-2">
                NPSHa = P_suc/(rho×g) - Pvap/(rho×g) + z_suc_min - hf_suc_total - V²/(2g)
              </code>
              <p className="text-sm text-muted-foreground mb-2">
                A pressão de vapor do fluido (Pvap) é interpolada de uma tabela
                termodinâmica cobrindo 0 °C a 150 °C. O sistema emite alerta crítico
                quando a margem de segurança é insuficiente:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                Margem = NPSHa - NPSHr {"  "}→{"  "}deve ser ≥ 0,5 mca (NBR 5626 item 6.3.1)
              </code>
            </div>

            {/* 2.7 Potência e Motor */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.7 Potência Hidráulica e Dimensionamento do Motor
              </h3>
              <div className="space-y-3">
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">Potência Hidráulica</p>
                  <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                    P_hid = rho × g × Q × HMT / 1000{"   "}(kW)
                  </code>
                </div>
                <div className="rounded-md border p-4">
                  <p className="font-medium text-sm mb-1">Potência no Eixo e do Motor</p>
                  <code className="block bg-muted text-xs px-3 py-2 rounded font-mono">
                    P_eixo = P_hid / eta_bomba{"   "}(eta_bomba = 0,70)
                    <br />
                    P_motor = P_eixo / eta_motor{"  "}(eta_motor = 0,92 — classe IE3)
                    <br />
                    P_nominal = proxima_potencia_comercial(P_motor × 1,15)
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    A margem de 15% sobre a potência calculada é aplicada antes da
                    seleção da potência comercial normalizada (26 valores de 0,18 kW
                    a 200 kW).
                  </p>
                </div>
              </div>
            </div>

            {/* 2.8 Rotação Específica */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.8 Rotação Específica (Ns) e Classificação da Bomba
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                A rotação específica classifica o tipo de bomba mais adequado para
                os parâmetros de projeto:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono mb-3">
                Ns = n × raiz(Q) / HMT^0,75{"   "}(Q em m³/s, HMT em m)
              </code>
              <Tabela
                headers={["Faixa de Ns", "Tipo de Bomba"]}
                rows={[
                  ["Ns < 25", "Centrífuga Radial (alta pressão)"],
                  ["25 ≤ Ns < 80", "Centrífuga Radial"],
                  ["80 ≤ Ns < 160", "Centrífuga Semi-radial"],
                  ["160 ≤ Ns < 300", "Fluxo Misto (diagonal)"],
                  ["Ns ≥ 300", "Axial (hélice)"],
                ]}
              />
              <p className="text-sm text-muted-foreground mt-2">
                O cálculo é apresentado para as rotações síncronas de 1.450 rpm e
                2.900 rpm (50 Hz), facilitando a seleção do equipamento.
              </p>
            </div>

            {/* 2.9 DN Econômico */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.9 Diâmetro Nominal Econômico
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                O diâmetro econômico é calculado pela velocidade econômica de
                referência e o resultado é ajustado para o DN comercial imediatamente
                superior:
              </p>
              <code className="block bg-muted text-xs px-3 py-2 rounded font-mono mb-2">
                D = raiz(4Q / (pi × V_econ)){"   "}→{"   "}DN comercial ≥ D
              </code>
              <Tabela
                headers={["Trecho", "Velocidade Econômica de Referência"]}
                rows={[
                  ["Sucção", "1,0 m/s"],
                  ["Recalque", "1,5 m/s"],
                ]}
              />
              <p className="text-sm text-muted-foreground mt-2">
                DN comerciais disponíveis: 15, 20, 25, 32, 40, 50, 65, 80, 100, 125,
                150, 200, 250, 300, 350, 400 mm.
              </p>
            </div>

            {/* 2.10 Reservatório */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                2.10 Dimensionamento de Reservatório (NBR 5626)
              </h3>
              <p className="text-sm text-muted-foreground">
                O módulo de reservatório calcula o volume mínimo necessário com base
                no consumo diário per capita por tipo de edificação, número de
                ocupantes e distribuição entre reservatório inferior e superior
                conforme tabelas da NBR 5626:2020. Edificações suportadas incluem
                residências, hotéis, hospitais, escolas, escritórios e outras
                categorias.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 3. Banco de Dados Internos ─────────────────────────────────── */}
        <Section
          icon={<Database className="h-5 w-5 text-primary" />}
          title="Banco de Dados Internos"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-2">Materiais de Tubulação (17 materiais)</h3>
              <Tabela
                headers={["Categoria", "Materiais", "Rugosidade ε (mm)"]}
                rows={[
                  ["Plásticos", "PVC, PEAD, PPR", "0,0015 – 0,002"],
                  ["Aços", "Carbono novo/usado, Comercial, Galvanizado novo/usado, Inox", "0,015 – 0,40"],
                  ["Ferros", "Fundido novo/usado, Galvanizado", "0,15 – 0,50"],
                  ["Não-ferroso", "Cobre", "0,0015"],
                  ["Concreto", "Liso, Comum", "0,30 – 1,00"],
                  ["Outros", "Fibrocimento, Vidro", "0,0015 – 0,025"],
                ]}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Conexões e Acessórios (18 tipos)</h3>
              <Tabela
                headers={["Categoria", "Componente", "K"]}
                rows={[
                  ["Conexões", "Cotovelo 90° raio curto", "0,9"],
                  ["Conexões", "Cotovelo 90° raio longo", "0,6"],
                  ["Conexões", "Cotovelo 45°", "0,4"],
                  ["Conexões", "Curva 90° / 45°", "0,4 / 0,2"],
                  ["Conexões", "Tê passagem direta / lateral / bilateral", "0,2 / 1,3 / 1,8"],
                  ["Válvulas", "Gaveta aberta / Esfera plena / Borboleta", "0,2 / 0,1 / 0,3"],
                  ["Válvulas", "Globo aberta / Retenção portinhola / Pé c/ crivo", "10,0 / 2,5 / 2,5"],
                  ["Entradas/Saídas", "Borda viva / Arredondada / Saída livre", "0,5 / 0,1 / 1,0"],
                  ["Conexões", "União / Luva", "0,05"],
                ]}
              />
            </div>
          </div>
        </Section>

        {/* ── 4. Sistema de Alertas ──────────────────────────────────────── */}
        <Section
          icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
          title="Sistema de Alertas e Conformidade ABNT"
        >
          <p className="text-sm text-muted-foreground mb-5">
            Após cada cálculo, o sistema analisa automaticamente os resultados e
            emite alertas classificados em três níveis de severidade. Os limites são
            extraídos diretamente das normas ABNT vigentes. Alertas do nível{" "}
            <strong>IMPEDITIVO</strong> indicam que o projeto, na configuração atual,{" "}
            <strong>não pode ser executado</strong> sem intervenção técnica.
          </p>

          <div className="space-y-3">
            <AlertaItem
              nivel="IMPEDITIVO"
              titulo="Fluido Incompatível"
              norma="NBR 5626:2020"
              item="Item 7.2"
              descricao="Fluido selecionado não é compatível com o sistema predial de água fria. Sistemas com fluidos não potáveis ou perigosos devem ser completamente separados da rede predial. Nenhum outro alerta é emitido — o cálculo é bloqueado."
            />
            <AlertaItem
              nivel="CRITICO"
              titulo="Risco de Cavitação"
              norma="NBR 5626:2020"
              item="Item 6.3.1"
              descricao="A margem de segurança entre NPSHa e NPSHr é inferior a 0,5 mca. Cavitação causa erosão nos impeleres, vibração, ruído excessivo e falha prematura da bomba. Ações corretivas: aumentar nível do reservatório, reduzir altura de sucção ou aumentar diâmetro da sucção."
            />
            <AlertaItem
              nivel="IMPEDITIVO"
              titulo="Pressão Estática Extrema"
              norma="NBR 5626:2020"
              item="Item 6.3.2"
              descricao="O desnível entre ponto mais alto e mais baixo do sistema excede 300 mca, tornando o projeto tecnicamente inviável na configuração atual. É obrigatório o redesenho com múltiplas zonas de pressão e consulta a engenheiro especialista."
            />
            <AlertaItem
              nivel="ATENCAO"
              titulo="Pressão Estática Elevada"
              norma="NBR 5626:2020"
              item="Item 6.3.2"
              descricao="O desnível excede 40 mca — limite máximo recomendado pela norma para uma única zona de pressão. Solução: instalar válvula redutora de pressão (VRP) regulada para 30–35 mca ou dividir o sistema em zonas independentes."
            />
            <AlertaItem
              nivel="ATENCAO"
              titulo="Velocidade de Sucção Elevada"
              norma="NBR 5626:2020"
              item="Item 6.2.1"
              descricao="A velocidade no ramal de sucção excede 2,0 m/s. Velocidades excessivas aumentam as perdas de carga na sucção, reduzem o NPSHa e intensificam o risco de cavitação. Solução: aumentar o diâmetro da tubulação de sucção."
            />
            <AlertaItem
              nivel="ATENCAO"
              titulo="Velocidade de Recalque Elevada"
              norma="NBR 5626:2020"
              item="Item 6.2.2"
              descricao="A velocidade no ramal de recalque excede 3,0 m/s. Velocidades altas causam golpe de aríete, ruído excessivo, erosão e maior consumo energético. Solução: aumentar o diâmetro da tubulação de recalque ou instalar amortecedor de pulsação."
            />
            <AlertaItem
              nivel="IMPEDITIVO"
              titulo="Viscosidade Excessiva"
              norma="NBR 5626:2020"
              item="Item 5.1"
              descricao="A viscosidade do fluido excede 100 cP. Bombas centrífugas convencionais não são adequadas para fluidos com alta viscosidade — o rendimento cai drasticamente e a seleção pelo método convencional fica inválida. Utilizar bomba industrial especializada com curvas corrigidas pelo fabricante."
            />
          </div>

          <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Persistência de alertas:</strong> Quando o usuário está
                autenticado, as confirmações de ciência dos alertas são registradas
                no banco de dados (Supabase) com identificação do projeto, usuário,
                endereço IP e data/hora, compondo um registro de auditoria rastreável.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 5. Normas ABNT ─────────────────────────────────────────────── */}
        <Section
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          title="Normas ABNT Implementadas"
        >
          <Tabela
            headers={["Norma", "Título", "Aplicação no Sistema"]}
            rows={[
              [
                "NBR 5626:2020",
                "Sistemas prediais de água fria e quente",
                "HMT, NPSH, velocidades, pressão estática, pesos de peças prediais, volume de reservatório",
              ],
              [
                "NBR 8160:1999",
                "Sistemas prediais de esgoto sanitário",
                "Método dos pesos para esgoto, diâmetros mínimos, declividades, velocidades em coletores",
              ],
              [
                "NBR 10844:1989",
                "Instalações prediais de águas pluviais",
                "Períodos de retorno, coeficientes de escoamento, dimensionamento de calhas e condutores",
              ],
              [
                "NBR 13714:2000",
                "Sistemas de hidrantes e mangotinhos",
                "Classificação de risco, vazões e pressões mínimas, reserva de incêndio",
              ],
              [
                "NBR 13969:1997",
                "Tanques sépticos e tratamento complementar",
                "Contribuição per capita, volume mínimo, tempo de detenção hidráulica, filtros anaeróbios",
              ],
            ]}
          />
        </Section>

        {/* ── 6. Responsabilidades ───────────────────────────────────────── */}
        <Section
          icon={<FileText className="h-5 w-5 text-red-500" />}
          title="Responsabilidades e Limitações"
        >
          <div className="space-y-5">
            <div className="rounded-lg border-2 border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-5">
              <h3 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Aviso Legal — Leia com Atenção
              </h3>
              <div className="space-y-3 text-sm text-red-900 dark:text-red-200">
                <p>
                  O CentriCalc é uma <strong>ferramenta de apoio ao dimensionamento</strong>,
                  destinada a engenheiros, técnicos e estudantes de engenharia. Os resultados
                  gerados têm caráter de estimativa baseada em modelos hidráulicos simplificados
                  e <strong>não constituem, por si só, um projeto executivo</strong>.
                </p>
                <p>
                  <strong>A responsabilidade técnica e legal pelo projeto</strong>, sua
                  execução, segurança e conformidade com as normas aplicáveis é
                  exclusivamente do{" "}
                  <strong>profissional habilitado (engenheiro com registro no CREA/CFT)</strong>{" "}
                  que assina e se responsabiliza pelo projeto.
                </p>
                <p>
                  Os desenvolvedores desta ferramenta <strong>não se responsabilizam</strong>{" "}
                  por danos materiais, pessoais ou ambientais decorrentes do uso direto ou
                  indireto dos resultados aqui calculados sem a devida verificação e validação
                  profissional.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Limitações Conhecidas do Modelo</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Os rendimentos de bomba (η = 0,70) e motor (η = 0,92) são valores típicos padrão. Para equipamentos específicos, utilize as curvas de desempenho do fabricante.",
                  "A curva do sistema exibida no gráfico é uma aproximação parabólica (H = H_estático + K·Q²). Sistemas com múltiplos trechos de diâmetros distintos podem apresentar desvios.",
                  "O modelo não contempla análise de transitórios hidráulicos (golpe de aríete). Para sistemas com longos ramais ou bombas de partida direta, a análise transiente deve ser realizada separadamente.",
                  "A seleção de bomba é apresentada por tipo (centrífuga radial, mista, axial) com base na rotação específica. A seleção do modelo comercial exige consulta ao catálogo do fabricante e verificação do ponto de operação na curva Q-H.",
                  "Fluidos com gases dissolvidos, misturas bifásicas ou fluidos não-newtonianos não são cobertos pelos modelos implementados.",
                  "Os cálculos de reservatório seguem os consumos per capita normativos, que podem não refletir consumos reais de edificações com perfis de uso atípicos.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Uso Recomendado</h3>
              <div className="space-y-2 text-sm">
                {[
                  { ok: true, text: "Pré-dimensionamento e estudos de viabilidade técnica" },
                  { ok: true, text: "Verificação rápida de ordens de grandeza (velocidades, HMT, potência)" },
                  { ok: true, text: "Apoio didático em disciplinas de instalações prediais e mecânica dos fluidos" },
                  { ok: true, text: "Geração de relatório técnico preliminar para reuniões com clientes" },
                  { ok: false, text: "Substituição de projeto executivo assinado por engenheiro responsável" },
                  { ok: false, text: "Especificação final de equipamento sem consulta ao catálogo do fabricante" },
                  { ok: false, text: "Projetos de sistemas críticos (hospitais, incêndio) sem revisão técnica independente" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    {item.ok ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span className={item.ok ? "" : "text-muted-foreground"}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 pb-4">
        CentriCalc v1.0.0 · Desenvolvido com React, TypeScript e Python ·{" "}
        Metodologias baseadas nas normas ABNT NBR 5626:2020 e NBR 8160:1999
      </p>
    </div>
  );
};

export default Sobre;
