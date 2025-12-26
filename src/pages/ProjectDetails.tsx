import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { CalculationResult } from "@/lib/api";
import { toast } from "sonner"; // Importando toast do Sonner

// Define a estrutura completa do projeto salvo
interface SavedProjectFull {
  id: string;
  name: string;
  usuario: string;
  data_criacao: string;
  Q: number;
  status: "ok" | "warning" | "error" | "validation_error";
  inputData: any; // Usamos 'any' para simplificar a tipagem dos dados de entrada complexos
  resultData: CalculationResult;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<SavedProjectFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    } else {
      setLoading(false);
      toast.error("ID do projeto não fornecido.");
      navigate("/meus-projetos");
    }
  }, [id, navigate]);

  const loadProject = (projectId: string) => {
    const savedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
    const foundProject = savedProjects.find((p: SavedProjectFull) => p.id === projectId);

    if (foundProject) {
      setProject(foundProject);
    } else {
      toast.error("Projeto não encontrado.");
      navigate("/meus-projetos");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Projeto Não Encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Não foi possível carregar os detalhes do projeto com ID: {id}.</p>
            <Button onClick={() => navigate("/meus-projetos")} className="mt-4">
              Voltar para Meus Projetos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Safely access the first suction system ID, or default if suc is not an array or empty
  const firstSuctionId = Array.isArray(project.inputData.suc) 
    ? project.inputData.suc[0]?.succao_id || 'N/A'
    : 'N/A';
  
  const suctionCount = Array.isArray(project.inputData.suc) 
    ? project.inputData.suc.length
    : 1;

  const dischargeCount = Array.isArray(project.inputData.recalque) 
    ? project.inputData.recalque.length
    : 1;


  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Button variant="ghost" onClick={() => navigate("/meus-projetos")} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Meus Projetos
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Detalhes do Projeto: {project.name}
        </h1>
        <p className="text-muted-foreground">
          Criado por {project.usuario} em {formatDate(project.data_criacao)}
        </p>
      </div>

      <div className="space-y-6">
        {/* Display Input Data Summary (Optional, but useful) */}
        <Card>
          <CardHeader>
            <CardTitle>Dados de Entrada Resumidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Vazão (m³/h)</p>
              <p className="font-semibold">{project.inputData.Q}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">NPSHr (m.c.a)</p>
              <p className="font-semibold">{project.inputData.NPSHr}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Sucções</p>
              <p className="font-semibold">
                {suctionCount} ({firstSuctionId})
              </p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Destinos</p>
              <p className="font-semibold">
                {dischargeCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display Results */}
        <h2 className="text-2xl font-bold pt-4">Resultados do Cálculo</h2>
        <ResultsDisplay result={project.resultData} />
      </div>
    </div>
  );
};

export default ProjectDetails;