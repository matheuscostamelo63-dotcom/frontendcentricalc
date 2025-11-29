# Regras do Editor de IA e Diretrizes do Projeto

Este documento descreve as principais tecnologias e regras específicas para o desenvolvimento neste projeto, garantindo consistência, manutenibilidade e adesão às melhores práticas estabelecidas.

## 1. Visão Geral da Pilha de Tecnologia (Tech Stack)

1.  **Framework:** React (utilizando Vite para tooling).
2.  **Linguagem:** TypeScript para segurança de tipos.
3.  **Estilização:** Tailwind CSS para estilização utility-first, garantindo design responsivo por padrão.
4.  **Componentes UI:** shadcn/ui (construído sobre Radix UI) para componentes acessíveis e de alta qualidade.
5.  **Roteamento:** React Router DOM para navegação client-side.
6.  **Gerenciamento de Estado/Dados:** React Query (`@tanstack/react-query`) para gerenciamento de estado do servidor e caching.
7.  **Gerenciamento de Formulários:** React Hook Form, tipicamente pareado com Zod para validação de esquema.
8.  **Ícones:** Lucide React para todos os ícones visuais.
9.  **Temas:** `next-themes` para gerenciamento de modo claro/escuro.
10. **Notificações:** Sonner para notificações toast modernas.

## 2. Regras de Uso de Bibliotecas

| Funcionalidade | Biblioteca/Ferramenta Recomendada | Regras Específicas |
| :--- | :--- | :--- |
| **Componentes UI** | shadcn/ui (Radix UI) | Sempre priorize os componentes shadcn/ui existentes. Crie componentes personalizados apenas se um componente shadcn/ui adequado não existir. |
| **Estilização** | Tailwind CSS | Use classes utilitárias exclusivamente. Garanta que todos os novos componentes sejam totalmente responsivos. |
| **Ícones** | `lucide-react` | Use este pacote para todos os ícones. |
| **Roteamento** | `react-router-dom` | Todas as rotas principais da aplicação devem ser definidas em `src/App.tsx`. Use o componente `NavLink` para links de navegação. |
| **Busca de Dados** | `@tanstack/react-query` | Use React Query para gerenciar dados assíncronos, caching e sincronização com o servidor. |
| **Formulários & Validação** | `react-hook-form` & `zod` | Use React Hook Form para gerenciar o estado do formulário e Zod para definir esquemas de entrada e validação. |
| **Notificações** | `sonner` | Use a biblioteca `sonner` para exibir feedback ao usuário (toasts). |
| **Estrutura de Arquivos** | Padronizada | Componentes em `src/components/`, páginas em `src/pages/`, e hooks em `src/hooks/`. |
| **Qualidade de Código** | TypeScript | Mantenha o uso estrito de TypeScript em todo o projeto. |