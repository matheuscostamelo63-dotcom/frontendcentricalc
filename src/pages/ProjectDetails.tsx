import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { CalculationResult, normalizeResult } from "@/lib/api";
import { toast } from "sonner";
import { loadProjectByIdAsync } from "@/services/projectsService";
import { useAuth } from "@/context/AuthContext";

interface SavedProjectFull {
  id: string;
  name: string;
  usuario: string;
  data_criacao: string;
  Q: number;
  status: "ok" | "warning" | "error" | "validation_error";
  inputData: any;
  resultData: CalculationResult;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<SavedProjectFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundReason, setNotFoundReason] = useState<"unauthenticated" | "missing" | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (id) {
      loadProject(id);
    } else {
      setLoading(false);
      toast.error("ID do projeto não fornecido.");
      navigate("/meus-projetos");
    }
  }, [id, navigate, authLoading]);

  const loadProject = async (projectId: string) => {
    try {
      const found = await loadProjectByIdAsync(projectId);
      if (found) {
        setProject({
          ...found,
          status: (found.status ?? "ok") as SavedProjectFull["status"],
          inputData: found.inputData,
          resultData: normalizeResult(found.resultData as any),
        });
      } else {
        setNotFoundReason(user ? "missing" : "unauthenticated");
      }
    } catch {
      toast.error("Erro ao carregar projeto.");
      navigate("/meus-projetos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    const isAuthIssue = notFoundReason === "unauthenticated";
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card className={isAuthIssue ? "border-warning" : "border-destructive"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isAuthIssue ? "text-warning" : "text-destructive"}`}>
              {isAuthIssue ? <LogIn className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {isAuthIssue ? "Login Necessário" : "Projeto Não Encontrado"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthIssue ? (
              <>
                <p className="mb-2">Este projeto está salvo na nuvem. Faça login para acessá-lo em qualquer dispositivo.</p>
                <p className="text-sm text-muted-foreground mb-4">Projetos sem login ficam salvos apenas no navegador local.</p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/login")}>
                    <LogIn className="mr-2 h-4 w-4" /> Fazer Login
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/meus-projetos")}>
                    Voltar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>Não foi possível carregar os detalhes do projeto com ID: {id}.</p>
                <Button onClick={() => navigate("/meus-projetos")} className="mt-4">
                  Voltar para Meus Projetos
                </Button>
              </>
            )}
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
              <p className="font-semibold">{project.Q}</p>
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
        <ResultsDisplay
          result={project.resultData}
          onCorrigirDimensionamento={
            project.inputData
              ? () =>
                  navigate("/", {
                    state: { inputData: project.inputData },
                  })
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ProjectDetails;