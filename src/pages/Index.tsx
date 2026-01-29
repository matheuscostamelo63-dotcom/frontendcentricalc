import { useState, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import {
  api,
  conversions,
  Material,
  CalculationInput,
  CalculationResult,
  DischargeSystem,
  SuctionSystem,
  PipeSection,
  Componente,
} from "@/lib/api";
import { SuctionSystemItemForm } from "@/components/forms/SuctionSystemItemForm";
import { DischargeSystemForm } from "@/components/forms/DischargeSystemForm";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { MobileHelpDrawer } from "@/components/MobileHelpDrawer";
import { CalculoReservatorio } from "@/components/reservatorio/CalculoReservatorio";
import { CalculoResponse } from "@/types/reservatorio";
import {
  SeletorTipoSistema,
  AbasMetodoVazao,
  FormularioManual,
  FormularioPesos,
  ResultadoVazao
} from "@/components/vazao";
import {
  validarTipoVazao,
  definirVazaoManual,
  calcularVazaoPesos,
  TipoSistema,
  MetodoVazao,
  VazaoResult,
  PecaInput
} from "@/services/vazaoService";
import { handleApiError } from "@/utils/errorHandler";
import { useSistema } from "@/context/SistemaContext";

// --- Form State Types ---

// Structure for components stored in form state (ID and count)
export interface FormComponentItem {
  id: string;
  count: number;
}

// Structure for Pipe Section in Form State
export interface FormPipeSection extends Omit<PipeSection, 'L' | 'D' | 'k_manual' | 'componentes'> {
  L: number | string;
  D: number | string;
  k_manual?: number | string;
  componentes: FormComponentItem[];
  lossMode: 'detailed' | 'manual'; // New field to track UI mode
}

// Structure for Suction System in Form State
interface FormSuctionSystem extends Omit<SuctionSystem, 'trechos' | 'nivel_nominal' | 'nivel_min' | 'nivel_max' | 'pressao_manometrica'> {
  nivel_nominal: number | string;
  nivel_min: number | string;
  nivel_max: number | string;
  pressao_manometrica?: number | string;
  trechos: FormPipeSection[];
}

// Structure for Discharge System in Form State
interface FormDischargeSystem extends Omit<DischargeSystem, 'trechos' | 'nivel_nominal' | 'nivel_min' | 'nivel_max' | 'pressao_manometrica'> {
  nivel_nominal: number | string;
  nivel_min: number | string;
  nivel_max: number | string;
  pressao_manometrica?: number | string;
  trechos: FormPipeSection[];
}

// Main Form Data Type (Q is now derived from vazaoResultado)
interface FormDataInput extends Omit<CalculationInput, "Q" | "NPSHr" | "fluido" | "suc" | "recalque"> {
  Q: number | string; // Kept for NPSHr calculation, but will be overwritten by vazaoResultado
  NPSHr: number | string;
  fluido: {
    densidade: number | string;
    viscosidade: number | string;
    temperatura: number | string;
    pressao_atm: number | string;
  };
  suc: FormSuctionSystem[];
  recalque: FormDischargeSystem[];
}

// --- Component ---

const Index = () => {
  const { tipoSistema, setTipoSistema } = useSistema(); // Use global context

  const [materials, setMaterials] = useState<Material[]>([]);
  const [components, setComponents] = useState<Componente[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [reservoirResult, setReservoirResult] = useState<CalculoResponse | null>(null);

  // --- Vazão State (Now local to Index, except tipoSistema) ---
  const [metodosPermitidos, setMetodosPermitidos] = useState<MetodoVazao[]>([]);
  const [metodoAtivo, setMetodoAtivo] = useState<MetodoVazao | null>(null);
  const [metodoRecomendado, setMetodoRecomendado] = useState<MetodoVazao | null>(null);
  const [vazaoResultado, setVazaoResultado] = useState<VazaoResult | null>(null);
  const [highlightField, setHighlightField] = useState<string | null>(null);
  // --- End Vazão State ---


  // Initial state for a single pipe section
  const initialPipeSection: FormPipeSection = {
    L: 0,
    D: 0,
    material: "",
    conexoes: 0,
    componentes: [],
    lossMode: 'detailed',
  };

  // Initial state for a single suction system
  const initialSuctionSystem: FormSuctionSystem = {
    succao_id: "Sucção 1",
    tipo_reservatorio: "aberto",
    nivel_nominal: 0,
    nivel_min: 0,
    nivel_max: 0,
    trechos: [initialPipeSection],
  };

  // Form state
  const [formData, setFormData] = useState<FormDataInput>({
    name: "",
    usuario: "",
    Q: "", // Q is now managed by vazaoResultado, but kept here for NPSHr input
    NPSHr: "",
    fluido: {
      densidade: 998,
      viscosidade: 1.0,
      temperatura: 20,
      pressao_atm: 101325,
    },
    suc: [initialSuctionSystem],
    recalque: [
      {
        destino_id: "Destino 1",
        tipo_reservatorio: "aberto",
        nivel_nominal: 0,
        nivel_min: 0,
        nivel_max: 0,
        trechos: [initialPipeSection],
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialData, componentData] = await Promise.all([
        api.getMateriais(),
        api.getComponentes(),
      ]);

      setMaterials(materialData);
      setComponents(componentData);

      // Set default material for existing sections
      if (materialData.length > 0) {
        const defaultMaterialId = materialData[0].id;
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
      toast.error("Não foi possível carregar dados essenciais (materiais/componentes).");
    } finally {
      setLoading(false);
    }
  };

  // --- Vazão Calculation Handlers ---

  // Use setTipoSistema from context
  const handleTipoSistemaChange = useCallback(async (tipo: TipoSistema) => {
    setTipoSistema(tipo);
    setVazaoResultado(null);
    setHighlightField(null);
    setFormData(prev => ({ ...prev, Q: "" })); // Clear Q when changing system type

    const validacao = await validarTipoVazao(tipo);
    setMetodosPermitidos(validacao.metodos_permitidos);
    setMetodoAtivo(validacao.recomendado);
    setMetodoRecomendado(validacao.recomendado);
  }, [setTipoSistema]);

  // NOVO HANDLER: Atualiza formData.Q em tempo real e limpa o resultado da vazão se estiver visível
  const handleManualQChange = (value: string) => {
    const parsedValue = parseFloat(value);
    const finalValue = isNaN(parsedValue) ? "" : parsedValue;

    setFormData((prev) => ({ ...prev, Q: finalValue }));

    // Se o usuário começar a editar a vazão, limpamos o card de resultado
    if (vazaoResultado) {
      setVazaoResultado(null);
    }
  };

  const handleSubmitManual = async (vazaoM3h: number) => {
    if (!tipoSistema) return;
    setCalculating(true);
    setHighlightField(null);

    const response = await definirVazaoManual(tipoSistema, vazaoM3h);

    setCalculating(false);

    if (response.sucesso && response.dados) {
      setVazaoResultado(response.dados.vazao);
      // ATUALIZAÇÃO: Atualiza Q no formData imediatamente após o cálculo manual
      setFormData(prev => ({
        ...prev,
        Q: response.dados!.vazao.valor_m3h,
      }));
    } else if (response.erro) {
      const field = handleApiError(response.erro);
      setHighlightField(field);
    }
  };

  const handleSubmitPesos = async (pecas: PecaInput[]) => {
    if (!tipoSistema) return;
    setCalculating(true);
    setHighlightField(null);

    const response = await calcularVazaoPesos(tipoSistema, pecas);

    setCalculating(false);

    if (response.sucesso && response.dados) {
      setVazaoResultado(response.dados.vazao);
      // ATUALIZAÇÃO: Atualiza Q no formData imediatamente após o cálculo por pesos
      setFormData(prev => ({
        ...prev,
        Q: response.dados!.vazao.valor_m3h,
      }));
    } else if (response.erro) {
      const field = handleApiError(response.erro);
      setHighlightField(field);
    }
  };

  const handleConfirmVazao = () => {
    if (vazaoResultado) {
      // Q já está atualizado em formData.
      toast.success(`Vazão de ${vazaoResultado.valor_m3h.toFixed(2)} m³/h confirmada.`);
      // Limpa vazaoResultado para que o bloco de cálculo de vazão desapareça,
      // permitindo que o usuário veja o restante do formulário (incluindo NPSHr).
      setVazaoResultado(null);
    }
  };

  const handleEditVazao = () => {
    setVazaoResultado(null);
    setHighlightField(null);
    // Reset Q in formData to allow re-entry
    setFormData(prev => ({
      ...prev,
      Q: "",
    }));
  };

  // --- End Vazão Calculation Handlers ---


  // --- Suction System Management (omitted for brevity, kept original logic) ---
  const addSuctionSystem = () => {
    const newSystem: FormSuctionSystem = {
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
          componentes: [],
          lossMode: 'detailed',
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
    field: string,
    value: string | number | FormPipeSection[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      suc: prev.suc.map((system, i) =>
        i === index
          ? { ...system, [field]: value }
          : system
      ),
    }));
  };
  // --- End Suction System Management ---


  // --- Discharge System Management (omitted for brevity, kept original logic) ---
  const addDischargeSystem = () => {
    const newSystem: FormDischargeSystem = {
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
          componentes: [],
          lossMode: 'detailed',
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
    field: string,
    value: string | number | FormPipeSection[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      recalque: prev.recalque.map((system, i) =>
        i === index ? { ...system, [field]: value } : system
      ),
    }));
  };
  // --- End Discharge System Management ---

  // Helper function to map FormPipeSection to API PipeSection
  const mapPipeSectionToApi = (section: FormPipeSection): PipeSection => {
    const apiSection: PipeSection = {
      L: Number(section.L) || 0,
      D: conversions.mmToM(Number(section.D) || 0),
      material: section.material,
      rugosidade_mm: section.rugosidade_mm,
      conexoes: 0, // Default to 0 for legacy field
    };

    if (section.lossMode === 'manual' && section.k_manual !== "" && section.k_manual !== undefined) {
      // Scenario 2: Using Manual K
      apiSection.k_manual = Number(section.k_manual);
    } else if (section.lossMode === 'detailed' && section.componentes && section.componentes.length > 0) {
      // Scenario 1: Using Detailed List
      const componentIds: string[] = [];
      section.componentes.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          componentIds.push(item.id);
        }
      });
      if (componentIds.length > 0) {
        apiSection.componentes = componentIds;
      }
    }
    // If neither new method is used, conexoes remains 0 (Scenario 3 legacy is ignored in new UI)

    return apiSection;
  };


  const handleCalculate = async () => {
    setCalculating(true);
    setResult(null);

    // Validation check: Vazão must be defined (Q in formData is now the source of truth after calculation)
    const Q_m3h = Number(formData.Q);
    if (Q_m3h <= 0) {
      toast.error("A vazão de projeto deve ser definida antes de calcular.");
      setCalculating(false);
      return;
    }

    // Basic validation check for required fields (NPSHr)
    if (formData.NPSHr === "") {
      toast.error("NPSHr é um campo obrigatório.");
      setCalculating(false);
      return;
    }

    try {
      // Convert units and map structure before sending
      const dataToSend: CalculationInput = {
        ...formData,
        Q: conversions.m3hToM3s(Q_m3h),
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
          trechos: s.trechos.map(mapPipeSectionToApi),
        })) as SuctionSystem[],
        // Convert Discharge Systems
        recalque: formData.recalque.map((r) => ({
          ...r,
          nivel_nominal: Number(r.nivel_nominal) || 0,
          nivel_min: Number(r.nivel_min) || 0,
          nivel_max: Number(r.nivel_max) || 0,
          pressao_manometrica: Number(r.pressao_manometrica) || 0,
          trechos: r.trechos.map(mapPipeSectionToApi),
        })) as DischargeSystem[],
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
        Q: Q_m3h, // Save the calculated Q
        status: calculationResult.status,
        // Save the full input data (before unit conversion)
        inputData: formData,
        // Save the full result data
        resultData: calculationResult,
        // Save reservoir data if available
        reservoirData: reservoirResult,
      };

      savedProjects.unshift(projectData); // Add to beginning of array
      localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
      // --- END: Saving Project Data ---


      if (calculationResult.status === "ok") {
        toast.success("Cálculo realizado com sucesso e projeto salvo!");
      } else if (calculationResult.status === "warning") {
        toast.warning("Cálculo concluído com avisos e projeto salvo.");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao realizar cálculo.";
      toast.error(message);
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
              componentes: [],
              lossMode: 'detailed',
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
              componentes: [],
              lossMode: 'detailed',
            },
          ],
        },
      ],
    });
    setResult(null);
    setVazaoResultado(null);
    setTipoSistema(null); // Reset global state
    setMetodosPermitidos([]);
    setMetodoAtivo(null);
    setMetodoRecomendado(null);
    setHighlightField(null);
    setReservoirResult(null);
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

  // Check if Q is a valid number > 0
  const isQDefined = Number(formData.Q) > 0;

  // Form is ready if Q is defined AND NPSHr is provided
  const isFormReadyToCalculate = isQDefined && formData.NPSHr !== "";

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
            </div>
          </CardContent>
        </Card>

        {/* Vazão Input Flow */}
        <Card>
          <CardHeader>
            <CardTitle>1. Definição da Vazão de Projeto (Q)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!vazaoResultado ? (
              <>
                <SeletorTipoSistema
                  value={tipoSistema}
                  onChange={handleTipoSistemaChange}
                  disabled={calculating}
                  highlightError={highlightField === 'tipo-sistema'}
                />

                {tipoSistema && (
                  <>
                    <AbasMetodoVazao
                      metodosPermitidos={metodosPermitidos}
                      metodoRecomendado={metodoRecomendado}
                      metodoAtivo={metodoAtivo || 'manual'}
                      onChangeMetodo={setMetodoAtivo}
                    />

                    <div className="mt-4">
                      {metodoAtivo === 'manual' && (
                        <FormularioManual
                          tipoSistema={tipoSistema}
                          onSubmit={handleSubmitManual}
                          loading={calculating}
                          highlightError={highlightField === 'vazao-manual'}
                          currentQ={formData.Q} // Passando o valor atual
                          onChangeQ={handleManualQChange} // Passando o novo handler
                        />
                      )}

                      {metodoAtivo === 'metodo_pesos' && (
                        <FormularioPesos
                          tipoSistema={tipoSistema}
                          onSubmit={handleSubmitPesos}
                          loading={calculating}
                          highlightError={highlightField === 'lista-pecas'}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <ResultadoVazao
                vazao={vazaoResultado}
                onConfirmar={handleConfirmVazao}
                onEditar={handleEditVazao}
              />
            )}
          </CardContent>
        </Card>

        {/* NPSHr Input (Visible if Q is defined in formData, which happens immediately after calculation/definition) */}
        {isQDefined && (
          <Card>
            <CardHeader>
              <CardTitle>2. Parâmetros da Bomba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vazao-confirmada">Vazão Confirmada (m³/h)</Label>
                  <Input
                    id="vazao-confirmada"
                    // Use formData.Q, which is updated by the vazao handlers
                    value={Number(formData.Q).toFixed(2)}
                    disabled
                    className="mt-1 bg-primary/10 font-semibold"
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
        )}


        {/* Fluid Parameters */}
        <Collapsible defaultOpen>
          <Card>
            <CardHeader>
              <CollapsibleTrigger className="w-full flex justify-between items-center">
                <CardTitle className="text-left">3. Parâmetros do Fluido</CardTitle>
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

        {/* Reservoir Calculation (Section 4) - Conditional for Predial */}
        {tipoSistema === 'predial' && (
          <div id="reservatorio-section" className="scroll-mt-20">
            <CalculoReservatorio onResultado={(res) => setReservoirResult(res)} />
          </div>
        )}

        {/* Suction Systems (Multiple) */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>5. Sistemas de Sucção</CardTitle>
              <Button onClick={addSuctionSystem} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Sucção
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.suc.map((system, index) => (
              <SuctionSystemItemForm
                // Usando o índice como chave para garantir estabilidade durante a edição do nome
                key={index}
                system={system as unknown as SuctionSystem}
                index={index}
                materials={materials}
                components={components} // Passando componentes
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
              <CardTitle>6. Sistemas de Recalque</CardTitle>
              <Button onClick={addDischargeSystem} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Destino
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.recalque.map((system, index) => (
              <DischargeSystemForm
                // Usando o índice como chave para garantir estabilidade durante a edição do nome
                key={index}
                system={system as unknown as DischargeSystem}
                index={index}
                materials={materials}
                components={components} // Passando componentes
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
            disabled={!isFormReadyToCalculate || calculating}
            className="gap-2"
          >
            {calculating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calcular Sistema
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Calcular Sistema
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