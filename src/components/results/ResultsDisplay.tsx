import { useState } from "react";
import { CalculationResult } from "@/lib/api";
import { StatusBanner } from "./StatusBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Download,
  Info,
  Wrench,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ResultsDisplayProps {
  result: CalculationResult;
  /** Quando fornecido, exibe o botão "Rever Projeto" nos resultados com alertas */
  onCorrigirDimensionamento?: () => void;
}

export const ResultsDisplay = ({ result, onCorrigirDimensionamento }: ResultsDisplayProps) => {
  const [dimensionamentoConfirmado, setDimensionamentoConfirmado] = useState(false);

  const hasProblems =
    result.status === "warning" ||
    result.status === "error" ||
    result.status === "validation_error" ||
    (result.errors && result.errors.length > 0) ||
    (result.warnings && result.warnings.length > 0);

  // PDF só disponível quando não há erros bloqueantes
  const pdfDisponivel =
    !!result.pdf_url &&
    result.status !== "error" &&
    result.status !== "validation_error";

  const temAvisos = result.status === "warning" || (result.warnings && result.warnings.length > 0);

  return (
    <div className="space-y-6">
      <StatusBanner status={result.status} />

      {/* Banner de ação: Rever Projeto */}
      {hasProblems && onCorrigirDimensionamento && (
        <Card className="border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600">
          <CardContent className="pt-5 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                    Dimensionamento com pendências
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Corrija os parâmetros abaixo e recalcule. Todos os dados de entrada
                    serão mantidos para facilitar o ajuste.
                  </p>
                </div>
              </div>
              <Button
                onClick={onCorrigirDimensionamento}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shrink-0 w-full sm:w-auto"
                size="sm"
              >
                <Wrench className="h-4 w-4" />
                Rever Projeto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erros de Validação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>
                  <strong>{error.campo}:</strong> {error.mensagem}
                  {error.tipo && (
                    <span className="text-xs ml-2">({error.tipo})</span>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Avisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.warnings.map((warning, index) => (
              <Alert key={index} className="border-warning bg-warning/10">
                <AlertDescription>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      {warning.nivel}
                    </Badge>
                    <div>
                      <div className="font-medium">{warning.categoria}</div>
                      <div className="text-sm">{warning.mensagem}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recomendacoes && result.recomendacoes.length > 0 && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Info className="h-5 w-5" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recomendacoes.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Key Results */}
      {result.H_mt_necessario !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Hmt Necessário
                </div>
                <div className="text-2xl font-bold text-primary">
                  {result.H_mt_necessario.toFixed(2)} mca
                </div>
              </div>
              {result.pressao_descarga_bomba_bar !== undefined && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Pressão de Descarga
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.pressao_descarga_bomba_bar.toFixed(2)} bar
                  </div>
                </div>
              )}
              {result.P_hid_kW !== undefined && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Potência Hidráulica
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.P_hid_kW.toFixed(2)} kW
                  </div>
                </div>
              )}
              {result.velocidade_succao_max !== undefined && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Velocidade Máx. Sucção
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.velocidade_succao_max.toFixed(2)} m/s
                  </div>
                </div>
              )}
              {result.NPSHa_global_min !== undefined && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    NPSHa Global Mínimo
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.NPSHa_global_min.toFixed(2)} mca
                  </div>
                </div>
              )}
              {result.temperatura !== undefined && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Temperatura
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.temperatura.toFixed(1)} °C
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motor Sizing */}
      {result.motor && result.motor.P_motor_nominal_kW > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Dimensionamento do Motor Elétrico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Potência Hidráulica</div>
                <div className="text-xl font-bold text-blue-700">
                  {result.motor.P_hidraulica_kW.toFixed(3)} kW
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Potência no Eixo</div>
                <div className="text-xl font-bold text-blue-700">
                  {result.motor.P_eixo_kW.toFixed(3)} kW
                </div>
                <div className="text-xs text-muted-foreground">
                  η_bomba = {(result.motor.eta_bomba_assumida * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground font-semibold">Motor Recomendado</div>
                <div className="text-xl font-bold text-green-700">
                  {result.motor.P_motor_nominal_kW.toFixed(2)} kW
                </div>
                <div className="text-sm font-medium text-green-600">
                  {result.motor.P_motor_nominal_cv.toFixed(1)} CV
                </div>
                <div className="text-xs text-muted-foreground">
                  η_motor = {(result.motor.eta_motor_assumida * 100).toFixed(0)}% (IE3) + 15% margem
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Rendimentos assumidos. Consulte a curva do fabricante para seleção definitiva.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ns Classification */}
      {result.ns_1450 !== undefined && result.ns_1450 > 0 && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-base">Rotação Específica (Ns) e Tipo de Bomba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Ns @ 1450 rpm</div>
                <div className="text-2xl font-bold text-purple-700">{result.ns_1450.toFixed(1)}</div>
              </div>
              {result.ns_2900 !== undefined && result.ns_2900 > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Ns @ 2900 rpm</div>
                  <div className="text-2xl font-bold text-purple-700">{result.ns_2900.toFixed(1)}</div>
                </div>
              )}
            </div>
            {result.tipo_bomba_ns && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm px-3 py-1">
                {result.tipo_bomba_ns}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mt-2 italic">
              Ns = n × √Q / H^0,75 — orienta a seleção do tipo de bomba adequado ao ponto de operação.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diâmetro Econômico */}
      {(result.dn_suc_mm || result.dn_rec_mm) && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-base">Sugestão de Diâmetro Econômico de Tubulação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.dn_suc_mm && result.dn_suc_mm > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Sucção</div>
                  <div className="text-2xl font-bold text-emerald-700">DN {result.dn_suc_mm}</div>
                  <div className="text-xs text-muted-foreground">V econômica: 1,0 m/s | NBR 5626: máx. 1,5 m/s</div>
                </div>
              )}
              {result.dn_rec_mm && result.dn_rec_mm > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Recalque</div>
                  <div className="text-2xl font-bold text-emerald-700">DN {result.dn_rec_mm}</div>
                  <div className="text-xs text-muted-foreground">V econômica: 1,5 m/s | máx. 2,5 m/s</div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              DN comercial imediatamente superior ao calculado — D = √(4Q / π × V_econômica).
            </p>
          </CardContent>
        </Card>
      )}

      {/* Destination Results */}
      {result.resultados_destinos && result.resultados_destinos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados por Destino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destino</TableHead>
                    <TableHead>Hmt Pior (m)</TableHead>
                    <TableHead>Hmt Nominal (m)</TableHead>
                    <TableHead>Hmt Melhor (m)</TableHead>
                    <TableHead>NPSHa (m)</TableHead>
                    <TableHead>Cavitação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.resultados_destinos.map((dest) => (
                    <TableRow key={dest.destino_id}>
                      <TableCell className="font-medium">
                        {dest.destino_id}
                      </TableCell>
                      <TableCell>{dest.Hmt_pior.toFixed(2)}</TableCell>
                      <TableCell>{dest.Hmt_nominal.toFixed(2)}</TableCell>
                      <TableCell>{dest.Hmt_melhor.toFixed(2)}</TableCell>
                      <TableCell>{dest.NPSHa.toFixed(2)}</TableCell>
                      <TableCell>
                        {dest.cavitation_ok ? (
                          <Badge className="bg-success text-success-foreground">
                            OK
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Problema</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Seção do Relatório PDF ─────────────────────────────────────────────── */}
      {pdfDisponivel && (
        <>
          {!dimensionamentoConfirmado ? (
            /* Etapa de confirmação — obrigatória antes de liberar o PDF */
            <Card
              className={
                temAvisos
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600"
                  : "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-600"
              }
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 text-base ${
                    temAvisos
                      ? "text-amber-800 dark:text-amber-300"
                      : "text-green-800 dark:text-green-300"
                  }`}
                >
                  {temAvisos ? (
                    <ShieldAlert className="h-5 w-5" />
                  ) : (
                    <ClipboardCheck className="h-5 w-5" />
                  )}
                  Confirmar Dimensionamento para Gerar Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-sm mb-4 ${
                    temAvisos
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-green-700 dark:text-green-400"
                  }`}
                >
                  {temAvisos
                    ? "Este dimensionamento possui avisos normativos. Revise os alertas acima e, se estiver ciente dos riscos, confirme para liberar o relatório PDF."
                    : "O dimensionamento está em conformidade. Confirme para liberar o download do relatório PDF completo."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {onCorrigirDimensionamento && (
                    <Button
                      variant="outline"
                      onClick={onCorrigirDimensionamento}
                      className="gap-2"
                      size="sm"
                    >
                      <Wrench className="h-4 w-4" />
                      Rever Projeto
                    </Button>
                  )}
                  <Button
                    onClick={() => setDimensionamentoConfirmado(true)}
                    className={`gap-2 ${
                      temAvisos
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    size="sm"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    {temAvisos
                      ? "Confirmar Ciente dos Avisos"
                      : "Confirmar Dimensionamento"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* PDF liberado após confirmação */
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Relatório PDF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Dimensionamento confirmado. O relatório completo com gráficos
                      e detalhes está disponível para download.
                    </p>
                  </div>
                  <Button asChild className="gap-2 shrink-0">
                    <a
                      href={result.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Relatório
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
