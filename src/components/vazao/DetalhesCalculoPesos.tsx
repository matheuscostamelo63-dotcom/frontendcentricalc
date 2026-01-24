import { PecaDetalhe } from "@/services/vazaoService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, Scale } from "lucide-react";

interface DetalhesCalculoPesosProps {
  detalhes: {
    soma_pesos: number;
    formula_aplicada: string;
    pecas: PecaDetalhe[];
  };
}

export const DetalhesCalculoPesos = ({ detalhes }: DetalhesCalculoPesosProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Resumo do Cálculo por Pesos</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-secondary p-3 rounded-lg flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Soma Total dos Pesos (ΣP)</p>
                <p className="font-semibold text-lg">{detalhes.soma_pesos.toFixed(1)}</p>
              </div>
            </div>
            <div className="bg-secondary p-3 rounded-lg flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Fórmula Aplicada</p>
                <p className="font-semibold text-lg">{detalhes.formula_aplicada}</p>
              </div>
            </div>
          </div>

          <h4 className="font-semibold mt-4">Peças Utilizadas no Cálculo</h4>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peça</TableHead>
                  <TableHead className="text-center">Qtd.</TableHead>
                  <TableHead className="text-right">Peso Unitário</TableHead>
                  <TableHead className="text-right">Peso Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalhes.pecas.map((peca) => (
                  <TableRow key={peca.tipo}>
                    <TableCell className="font-medium">{peca.nome_exibicao}</TableCell>
                    <TableCell className="text-center">{peca.quantidade}</TableCell>
                    <TableCell className="text-right">{peca.peso_unitario.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-semibold">{peca.peso_total.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};