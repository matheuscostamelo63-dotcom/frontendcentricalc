import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/index.auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess('Link de recuperação enviado para o seu e-mail!');
      setEmail('');
    } catch (err: unknown) {
      console.error('Erro na recuperação:', err);
      setError('Erro ao enviar link de recuperação. Verifique o e-mail informado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-logo-section">
          <img src="/logo.png" alt="CentriCalc Logo" className="auth-main-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1>Recuperar Senha</h1>
          <p>Enviaremos um link para o seu e-mail</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}
        {success && <div className="auth-success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">E-mail de Cadastro</label>
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

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            <span>Enviar Link de Recuperação</span>
            {loading && <div className="auth-loading-spinner" />}
          </button>
        </form>

        <div className="auth-footer-links">
          <p><span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 500 }}>Voltar para o Login</span></p>
        </div>
      </div>
    </div>
  );
}
