import { useEffect } from 'react';

/**
 * Componente para sincronizar sessões Supabase entre domínios.
 * Captura access_token e refresh_token da URL hash e salva no localStorage local.
 */
export function AuthSync() {
    useEffect(() => {
        try {
            const hash = window.location.hash;
            if (!hash) return;

            // Remove o # inicial e divide por &
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
                console.log("[AuthSync] Token de autenticação detectado na URL. Sincronizando...");

                const supabaseProjectRef = "mlabsszxdvhdiwxzdqms";
                const storageKey = `sb-${supabaseProjectRef}-auth-token`;

                // Monta o objeto de sessão conforme o Supabase espera
                const session = {
                    access_token: accessToken,
                    refresh_token: refreshToken || '',
                    expires_in: 3600, // Valor padrão se não vier na URL
                    token_type: 'bearer',
                    user: { id: 'temp' } // O Supabase Client irá atualizar os dados reais do user depois
                };

                localStorage.setItem(storageKey, JSON.stringify(session));
                console.log("[AuthSync] Sessão sincronizada com sucesso!");

                // Limpa a URL para não deixar o token exposto e não reprocessar
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        } catch (error) {
            console.error("[AuthSync] Erro ao sincronizar tokens:", error);
        }
    }, []);

    return null; // Componente lógico, não renderiza nada
}
