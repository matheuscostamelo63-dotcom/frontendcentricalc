import { useState, useEffect } from "react";
import { Calculator, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  api,
  conversions,
  Material,
  CalculationInput,
  CalculationResult,
  DischargeSystem,
  PipeSection,
} from "@/lib/api";
import { SuctionSystemForm } from "@/components/forms/SuctionSystemForm";
import { DischargeSystemForm } from "@/components/forms/DischargeSystemForm";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";

// Form data type that allows empty strings for number inputs
type FormDataInput = Omit<CalculationInput, "Q" | "NPSHr" | "fluido"> & {
  Q: number | string;
  NPSHr: number | string;
  fluido: {
    densidade: number | string;
    viscosidade: number | string;
    temperatura: number | string;
    pressao_atm: number;
  };
};

const Index = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormDataInput>({
    name: "",
    usuario: "",
    Q: "",
    NPSHr: "",
    fluido: {
      densidade: 998,
      viscosidade: 1.0,
      temperatura: 20,
      pressao_atm: 101325,
    },
    suc: {
      tipo_reservatorio: "aberto",
      nivel_nominal: 0,
      nivel_min: 0,
      nivel_max: 0,
      trechos: [
        {
          L: 0,
          D: 0,
          material: "",
          conexoes: 0,
        },
      ],
    },
    recalque: [
      {
        destino_id: "Destino 1",
        tipo_reservatorio: "aberto",
        nivel_nominal: 0,
        nivel_min: 0,
        nivel_max: 0,
        trechos: [
          {
            L: 0,
            D: 0,
            material: "",
            conexoes: 0,
          },
        ],
      },
    ],
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await api.getMateriais();
      setMaterials(data);
      
      // Set default material for existing sections
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          suc: {
            ...prev.suc,
            trechos: prev.suc.trechos.map((t) => ({
              ...t,
              material: t.material || data[0].id,
            })),
          },
          recalque: prev.recalque.map((r) => ({
            ...r,
            trechos: r.trechos.map((t) => ({
              ...t,
              material: t.material || data[0].id,
            })),
          })),
        }));
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os materiais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDischargeSystem = () => {
    const newSystem: DischargeSystem = {
      destino_id: `Destino ${formData.recalque.length + 1}`,
      tipo_reservatorio: "aberto",
      nivel_nominal: 0,
      nivel_min: 0,
      nivel_max: 0,
      trechos: [
        {
          L: 0,
          D: 0,
          material: materials[0]?.id || "",
          conexoes: 0,
        },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      recalque: [...prev.recalque, newSystem],
    }));
  };

  const removeDischargeSystem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recalque: prev.recalque.filter((_, i) => i !== index),
    }));
  };

  const updateDischargeSystem = (
    index: number,
    field: keyof DischargeSystem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      recalque: prev.recalque.map((system, i) =>
        i === index ? { ...system, [field]: value } : system
      ),
    }));
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setResult(null);

    try {
      // Convert units before sending
      const dataToSend: CalculationInput = {
        ...formData,
        Q: conversions.m3hToM3s(Number(formData.Q) || 0),
        NPSHr: Number(formData.NPSHr) || 0,
        fluido: {
          ...formData.fluido,
          densidade: Number(formData.fluido.densidade) || 998,
          viscosidade: conversions.cpToPas(Number(formData.fluido.viscosidade) || 1.0),
          temperatura: Number(formData.fluido.temperatura) || 20,
        },
        suc: {
          ...formData.suc,
          trechos: formData.suc.trechos.map((t) => ({
            ...t,
            D: conversions.mmToM(t.D),
          })),
        },
        recalque: formData.recalque.map((r) => ({
          ...r,
          trechos: r.trechos.map((t) => ({
            ...t,
            D: conversions.mmToM(t.D),
          })),
        })),
      };

      const calculationResult = await api.calcular(dataToSend);
      setResult(calculationResult);

      // Save project to LocalStorage
      const savedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
      const projectData = {
        id: Date.now().toString(),
        name: formData.name || "Projeto sem nome",
        usuario: formData.usuario || "Não especificado",
        data_criacao: new Date().toISOString(),
        Q: Number(formData.Q) || 0,
        status: calculationResult.status,
      };
      
      savedProjects.unshift(projectData); // Add to beginning of array
      localStorage.setItem("savedProjects", JSON.stringify(savedProjects));

      if (calculationResult.status === "ok") {
        toast({
          title: "Sucesso",
          description: "Cálculo realizado com sucesso e projeto salvo!",
        });
      } else if (calculationResult.status === "warning") {
        toast({
          title: "Aviso",
          description: "Cálculo concluído com avisos e projeto salvo.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao realizar cálculo.",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      usuario: "",
      Q: "",
      NPSHr: "",
      fluido: {
        densidade: 998,
        viscosidade: 1.0,
        temperatura: 20,
        pressao_atm: 101325,
      },
      suc: {
        tipo_reservatorio: "aberto",
        nivel_nominal: 0,
        nivel_min: 0,
        nivel_max: 0,
        trechos: [
          {
            L: 0,
            D: 0,
            material: materials[0]?.id || "",
            conexoes: 0,
          },
        ],
      },
      recalque: [
        {
          destino_id: "Destino 1",
          tipo_reservatorio: "aberto",
          nivel_nominal: 0,
          nivel_min: 0,
          nivel_max: 0,
          trechos: [
            {
              L: 0,
              D: 0,
              material: materials[0]?.id || "",
              conexoes: 0,
            },
          ],
        },
      ],
    });
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Novo Dimensionamento
        </h1>
        <p className="text-muted-foreground">
          Preencha os parâmetros para realizar o cálculo do sistema de bombeamento
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Nome do Projeto</Label>
                <Input
                  id="project-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Digite o nome do projeto"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="usuario">Usuário/Responsável</Label>
                <Input
                  id="usuario"
                  type="email"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, usuario: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vazao">Vazão Desejada (m³/h)</Label>
                <Input
                  id="vazao"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.Q}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Q: e.target.value === "" ? "" : parseFloat(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="npshr">NPSHr (m.c.a)</Label>
                <Input
                  id="npshr"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.NPSHr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      NPSHr: e.target.value === "" ? "" : parseFloat(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fluid Parameters */}
        <Collapsible defaultOpen>
          <Card>
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <CardTitle className="text-left">Parâmetros do Fluido</CardTitle>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="densidade">Densidade (kg/m³)</Label>
                    <Input
                      id="densidade"
                      type="number"
                      step="0.1"
                      value={formData.fluido.densidade}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fluido: {
                            ...prev.fluido,
                            densidade: e.target.value === "" ? "" : parseFloat(e.target.value),
                          },
                        }))
                      }
                      placeholder="998"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="viscosidade">Viscosidade (cP)</Label>
                    <Input
                      id="viscosidade"
                      type="number"
                      step="0.01"
                      value={formData.fluido.viscosidade}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fluido: {
                            ...prev.fluido,
                            viscosidade: e.target.value === "" ? "" : parseFloat(e.target.value),
                          },
                        }))
                      }
                      placeholder="1.0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperatura">Temperatura (°C)</Label>
                    <Input
                      id="temperatura"
                      type="number"
                      step="0.1"
                      value={formData.fluido.temperatura}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fluido: {
                            ...prev.fluido,
                            temperatura: e.target.value === "" ? "" : parseFloat(e.target.value),
                          },
                        }))
                      }
                      placeholder="20"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pressao-atm">Pressão Atmosférica (kPa)</Label>
                    <Input
                      id="pressao-atm"
                      type="number"
                      step="0.1"
                      value={conversions.paToKpa(formData.fluido.pressao_atm).toFixed(
                        2
                      )}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fluido: {
                            ...prev.fluido,
                            pressao_atm:
                              conversions.kpaToPa(parseFloat(e.target.value)) ||
                              101325,
                          },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nota: A pressão de vapor é calculada automaticamente com base na
                  temperatura da água.
                </p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Suction System */}
        <Collapsible defaultOpen>
          <Card>
            <CardHeader>
              <CollapsibleTrigger className="w-full">
                <CardTitle className="text-left">Sistema de Sucção</CardTitle>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <SuctionSystemForm
                  system={formData.suc}
                  materials={materials}
                  onChange={(field, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      suc: { ...prev.suc, [field]: value },
                    }))
                  }
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Discharge Systems */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sistemas de Recalque</CardTitle>
              <Button onClick={addDischargeSystem} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Destino
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.recalque.map((system, index) => (
              <DischargeSystemForm
                key={index}
                system={system}
                index={index}
                materials={materials}
                onChange={updateDischargeSystem}
                onRemove={removeDischargeSystem}
                canRemove={formData.recalque.length > 1}
              />
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Limpar Formulário
          </Button>
          <Button
            onClick={handleCalculate}
            disabled={calculating}
            className="gap-2"
          >
            {calculating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Calcular
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Resultados</h2>
            <ResultsDisplay result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
