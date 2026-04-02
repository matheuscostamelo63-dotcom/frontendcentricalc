import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/index.auth.css';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Supabase redirects with hash params that must be processed
  useEffect(() => {
    // supabase-js v2 automatically picks up the token from the URL hash
    // and sets the session. We just need to wait for the session to be set.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Session is set, ready for the user to enter a new password
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const pwdChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    num: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!PASSWORD_REGEX.test(password)) {
      setError('A senha não atende aos requisitos de segurança.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess('Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      console.error('Erro ao redefinir senha:', err);
      setError('Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-logo-section">
          <img src="/logo.png" alt="CentriCalc Logo" className="auth-main-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1>Nova Senha</h1>
          <p>Escolha uma senha forte e segura</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}
        {success && <div className="auth-success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="password">Nova Senha</label>
            <input id="password" type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="auth-password-requirements">
              <p className={`auth-req ${pwdChecks.length ? 'valid' : ''}`}>• Mínimo 8 caracteres</p>
              <p className={`auth-req ${pwdChecks.upper ? 'valid' : ''}`}>• Letra maiúscula</p>
              <p className={`auth-req ${pwdChecks.lower ? 'valid' : ''}`}>• Letra minúscula</p>
              <p className={`auth-req ${pwdChecks.num ? 'valid' : ''}`}>• Número</p>
              <p className={`auth-req ${pwdChecks.special ? 'valid' : ''}`}>• Caractere especial</p>
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirm-password">Confirmar Nova Senha</label>
            <input id="confirm-password" type="password" className="auth-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            <span>Redefinir Senha</span>
            {loading && <div className="auth-loading-spinner" />}
          </button>
        </form>
      </div>
    </div>
  );
}
