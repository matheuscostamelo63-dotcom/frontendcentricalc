import { useState, useEffect } from "react";
import { Calculator, Plus, Loader2, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner"; // Importando toast do Sonner
import {
  api,
  conversions,
  Material,
  CalculationInput,
  CalculationResult,
  DischargeSystem,
  SuctionSystem,
  PipeSection,
} from "@/lib/api";
import { SuctionSystemItemForm } from "@/components/forms/SuctionSystemItemForm";
import { DischargeSystemForm } from "@/components/forms/DischargeSystemForm";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { Separator } from "@/components/ui/separator";
import { MobileHelpDrawer } from "@/components/MobileHelpDrawer";

// Form data type that allows empty strings for number inputs
type FormDataInput = Omit<CalculationInput, "Q" | "NPSHr" | "fluido" | "suc"> & {
  Q: number | string;
  NPSHr: number | string;
  fluido: {
    densidade: number | string;
    viscosidade: number | string;
    temperatura: number | string;
    pressao_atm: number | string;
  };
  suc: (Omit<SuctionSystem, keyof SuctionSystem> & {
    nivel_nominal: number | string;
    nivel_min: number | string;
    nivel_max: number | string;
    pressao_manometrica?: number | string;
    trechos: (Omit<PipeSection, keyof PipeSection> & {
      L: number | string;
      D: number | string;
      conexoes: number | string;
    })[];
  })[];
};

const Index = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Initial state for a single suction system
  const initialSuctionSystem: FormDataInput['suc'][0] = {
    succao_id: "Sucção 1",
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
  };

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
    suc: [initialSuctionSystem], // Now an array
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

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined || val === "" ? "" : val;

  // Helper function to handle number input changes for the main form
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormDataInput | keyof FormDataInput['fluido']
  ) => {
    const value = e.target.value;
    if (value === "") {
      if (field === 'densidade' || field === 'viscosidade' || field === 'temperatura' || field === 'pressao_atm') {
        setFormData((prev) => ({
          ...prev,
          fluido: { ...prev.fluido, [field]: "" },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: "" }));
      }
    } else {
      const parsedValue = parseFloat(value);
      const finalValue = isNaN(parsedValue) ? "" : parsedValue;

      if (field === 'densidade' || field === 'viscosidade' || field === 'temperatura' || field === 'pressao_atm') {
        setFormData((prev) => ({
          ...prev,
          fluido: { ...prev.fluido, [field]: finalValue },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: finalValue }));
      }
    }
  };

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
        const defaultMaterialId = data[0].id;
        setFormData((prev) => ({
          ...prev,
          suc: prev.suc.map((s) => ({
            ...s,
            trechos: s.trechos.map((t) => ({
              ...t,
              material: t.material || defaultMaterialId,
            })),
          })),
          recalque: prev.recalque.map((r) => ({
            ...r,
            trechos: r.trechos.map((t) => ({
              ...t,
              material: t.material || defaultMaterialId,
            })),
          })),
        }));
      }
    } catch (error) {
      toast.error("Não foi possível carregar os materiais.");
    } finally {
      setLoading(false);
    }
  };

  // --- Suction System Management ---
  const addSuctionSystem = () => {
    const newSystem: FormDataInput['suc'][0] = {
      succao_id: `Sucção ${formData.suc.length + 1}`,
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
      suc: [...prev.suc, newSystem],
    }));
  };

  const removeSuctionSystem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      suc: prev.suc.filter((_, i) => i !== index),
    }));
  };

  const updateSuctionSystem = (
    index: number,
    field: keyof SuctionSystem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      suc: prev.suc.map((system, i) =>
        i === index ? { ...system, [field]: value } : system
      ),
    }));
  };
  // --- End Suction System Management ---


  // --- Discharge System Management ---
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
  // --- End Discharge System Management ---


  const handleCalculate = async () => {
    setCalculating(true);
    setResult(null);

    // Basic validation check for required fields (Q and NPSHr)
    if (formData.Q === "" || formData.NPSHr === "") {
      toast.error("Vazão Desejada e NPSHr são campos obrigatórios.");
      setCalculating(false);
      return;
    }

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
          pressao_atm: Number(formData.fluido.pressao_atm) || 101325,
        },
        // Convert Suction Systems
        suc: formData.suc.map((s) => ({
          ...s,
          nivel_nominal: Number(s.nivel_nominal) || 0,
          nivel_min: Number(s.nivel_min) || 0,
          nivel_max: Number(s.nivel_max) || 0,
          pressao_manometrica: Number(s.pressao_manometrica) || 0,
          trechos: s.trechos.map((t) => ({
            ...t,
            D: conversions.mmToM(Number(t.D) || 0),
            L: Number(t.L) || 0,
            conexoes: Number(t.conexoes) || 0,
          })),
        })) as SuctionSystem[], // Cast to ensure correct type after conversion
        // Convert Discharge Systems
        recalque: formData.recalque.map((r) => ({
          ...r,
          nivel_nominal: Number(r.nivel_nominal) || 0,
          nivel_min: Number(r.nivel_min) || 0,
          nivel_max: Number(r.nivel_max) || 0,
          pressao_manometrica: Number(r.pressao_manometrica) || 0,
          trechos: r.trechos.map((t) => ({
            ...t,
            D: conversions.mmToM(Number(t.D) || 0),
            L: Number(t.L) || 0,
            conexoes: Number(t.conexoes) || 0,
          })),
        })) as DischargeSystem[], // Cast to ensure correct type after conversion
      };

      const calculationResult = await api.calcular(dataToSend);
      setResult(calculationResult);

      // --- START: Saving Project Data ---
      const savedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
      
      // Create a unique ID and timestamp
      const projectId = Date.now().toString();
      const creationDate = new Date().toISOString();

      const projectData = {
        id: projectId,
        name: formData.name || `Projeto ${savedProjects.length + 1}`,
        usuario: formData.usuario || "Não especificado",
        data_criacao: creationDate,
        Q: Number(formData.Q) || 0,
        status: calculationResult.status,
        // Save the full input data (before unit conversion)
        inputData: formData, 
        // Save the full result data
        resultData: calculationResult,
      };
      
      savedProjects.unshift(projectData); // Add to beginning of array
      localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
      // --- END: Saving Project Data ---


      if (calculationResult.status === "ok") {
        toast.success("Cálculo realizado com sucesso e projeto salvo!");
      } else if (calculationResult.status === "warning") {
        toast.warning("Cálculo concluído com avisos e projeto salvo.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar cálculo.");
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    const defaultMaterialId = materials[0]?.id || "";
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
      suc: [
        {
          succao_id: "Sucção 1",
          tipo_reservatorio: "aberto",
          nivel_nominal: 0,
          nivel_min: 0,
          nivel_max: 0,
          trechos: [
            {
              L: 0,
              D: 0,
              material: defaultMaterialId,
              conexoes: 0,
            },
          ],
        },
      ],
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
              material: defaultMaterialId,
              conexoes: 0,
            },
          ],
        },
      ],
    });
    setResult(null);
  };

  // Custom display for atmospheric pressure (Pa to kPa conversion)
  const displayAtmPressure = (pa: number | string | undefined) => {
    if (pa === 0 || pa === undefined || pa === "") return "";
    // Return the raw converted value as a string, without fixed decimals
    return String(conversions.paToKpa(Number(pa)));
  };

  const handleAtmPressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      // Store "" if input is empty
      setFormData((prev) => ({
        ...prev,
        fluido: {
          ...prev.fluido,
          pressao_atm: "",
        },
      }));
    } else {
      const parsedValue = parseFloat(value);
      // Convert kPa to Pa for storage
      const paValue = isNaN(parsedValue) ? "" : conversions.kpaToPa(parsedValue);
      setFormData((prev) => ({
        ...prev,
        fluido: {
          ...prev.fluido,
          pressao_atm: paValue,
        },
      }));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          CentriCalc: Novo Dimensionamento
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
                  value={displayValue(formData.Q)}
                  onChange={(e) => handleNumberChange(e, "Q")}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="npshr">NPSHr (m.c.a)</Label>
                  <MobileHelpDrawer title="NPSHr (Net Positive Suction Head Required)">
                    <p className="font-semibold mb-1">NPSHr (Net Positive Suction Head Required)</p>
                    <p className="text-sm">
                      É a altura manométrica de sucção mínima requerida pela bomba para evitar a cavitação.
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Onde encontrar:</strong> Este valor é fornecido pelo fabricante da bomba e deve ser lido na curva de desempenho da bomba para a vazão desejada (Q).
                    </p>
                  </MobileHelpDrawer>
                </div>
                <Input
                  id="npshr"
                  type="number"
                  step="0.1"
                  min="0"
                  value={displayValue(formData.NPSHr)}
                  onChange={(e) => handleNumberChange(e, "NPSHr")}
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
              <CollapsibleTrigger className="w-full flex justify-between items-center">
                <CardTitle className="text-left">Parâmetros do Fluido</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
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
                      value={displayValue(formData.fluido.densidade)}
                      onChange={(e) => handleNumberChange(e, "densidade")}
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
                      value={displayValue(formData.fluido.viscosidade)}
                      onChange={(e) => handleNumberChange(e, "viscosidade")}
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
                      value={displayValue(formData.fluido.temperatura)}
                      onChange={(e) => handleNumberChange(e, "temperatura")}
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
                      value={displayAtmPressure(formData.fluido.pressao_atm)}
                      onChange={handleAtmPressureChange}
                      placeholder="101.325"
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

        {/* Suction Systems (Multiple) */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sistemas de Sucção</CardTitle>
              <Button onClick={addSuctionSystem} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Sucção
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.suc.map((system, index) => (
              <SuctionSystemItemForm
                key={index}
                system={system as SuctionSystem}
                index={index}
                materials={materials}
                onChange={updateSuctionSystem}
                onRemove={removeSuctionSystem}
                canRemove={formData.suc.length > 1}
              />
            ))}
          </CardContent>
        </Card>

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
      </div>

      {/* Results section moved below the form */}
      {(loading || result) && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Resultados do Dimensionamento</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : result ? (
                <ResultsDisplay result={result} />
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;