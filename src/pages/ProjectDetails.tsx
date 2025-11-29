import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { CalculationResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [project, setProject] = useState<SavedProjectFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    } else {
      setLoading(false);
      toast({
        title: "Erro",
        description: "ID do projeto não fornecido.",
        variant: "destructive",
      });
      navigate("/meus-projetos");
    }
  }, [id, navigate, toast]);

  const loadProject = (projectId: string) => {
    const savedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
    const foundProject = savedProjects.find((p: SavedProjectFull) => p.id === projectId);

    if (foundProject) {
      setProject(foundProject);
    } else {
      toast({
        title: "Erro",
        description: "Projeto não encontrado.",
        variant: "destructive",
      });
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
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Vazão (m³/h)</p>
              <p className="font-semibold">{project.inputData.Q}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">NPSHr (m.c.a)</p>
              <p className="font-semibold">{project.inputData.NPSHr}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Fluido</p>
              <p className="font-semibold">
                {project.inputData.fluido.densidade} kg/m³
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