import { CalculationResult } from "@/lib/api";
import { StatusBanner } from "./StatusBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle, Download, Info } from "lucide-react";
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
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  return (
    <div className="space-y-6">
      <StatusBanner status={result.status} />

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
                  {result.H_mt_necessario.toFixed(2)} m
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
                    {result.NPSHa_global_min.toFixed(2)} m
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

      {/* PDF Download */}
      {result.pdf_url && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>Relatório PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  O relatório completo com gráficos e detalhes está disponível
                  para download.
                </p>
              </div>
              <Button asChild className="gap-2">
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
    </div>
  );
};