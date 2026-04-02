import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/index.auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        navigate(decodeURIComponent(redirectTo));
      }
    } catch (err: unknown) {
      console.error('Erro no login:', err);
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-logo-section">
          <img src="/logo.png" alt="CentriCalc Logo" className="auth-main-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1>CentriCalc</h1>
          <p>Sistema de Dimensionamento Inteligente</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            <span>Entrar no Sistema</span>
            {loading && <div className="auth-loading-spinner" />}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>Não tem uma conta? <Link to="/register">Registre-se!</Link></p>
          <p style={{ marginTop: '12px' }}><Link to="/forgot-password">Esqueceu sua senha?</Link></p>
        </div>
      </div>
    </div>
  );
}
