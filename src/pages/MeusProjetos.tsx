import { useState, useEffect } from "react";
import { Search, Calendar, User, FileText, Trash2, Eye, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedProject {
  id: string;
  name: string;
  usuario: string;
  data_criacao: string;
  Q: number;
  status?: string;
}

const MeusProjetos = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    // Carrega projetos do LocalStorage
    const savedProjects = localStorage.getItem("savedProjects");
    if (savedProjects) {
      // Filtra apenas os campos necessários para a lista, mas garante que o ID está lá
      const parsedProjects = JSON.parse(savedProjects).map((p: any) => ({
        id: p.id,
        name: p.name,
        usuario: p.usuario,
        data_criacao: p.data_criacao,
        Q: p.Q,
        status: p.status,
      }));
      setProjects(parsedProjects);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      // Remove o projeto do estado local
      const updatedProjects = projects.filter((p) => p.id !== projectToDelete);
      setProjects(updatedProjects);
      
      // Remove o projeto do LocalStorage (incluindo todos os dados)
      const fullSavedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
      const updatedFullProjects = fullSavedProjects.filter((p: SavedProject) => p.id !== projectToDelete);
      localStorage.setItem("savedProjects", JSON.stringify(updatedFullProjects));

      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/meus-projetos/${id}`);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Meus Projetos
        </h1>
        <p className="text-muted-foreground">
          Gerencie e acesse seus projetos de dimensionamento salvos
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por nome do projeto ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm
                ? "Nenhum projeto corresponde à sua busca."
                : "Você ainda não criou nenhum projeto. Comece criando um novo dimensionamento."}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate("/")}>
                <Calculator className="mr-2 h-4 w-4" />
                Novo Dimensionamento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2">{project.name}</span>
                  {project.status && (
                    <Badge
                      variant={
                        project.status === "ok"
                          ? "default"
                          : project.status === "warning"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {project.status}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{project.usuario}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(project.data_criacao)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Vazão: {project.Q} m³/h</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewProject(project.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeusProjetos;