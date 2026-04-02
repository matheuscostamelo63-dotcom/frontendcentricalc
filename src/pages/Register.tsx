import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/index.auth.css';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

async function getUserIP(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return null;
  }
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    if (!PASSWORD_REGEX.test(password)) {
      setError('A senha não atende aos requisitos de segurança.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você precisa concordar com os Termos de Uso para se cadastrar.');
      return;
    }

    setLoading(true);
    try {
      const userIp = await getUserIP();

      // 1. Verificação Silenciosa de Plano (Whitelist vs Trial)
      const { data: whitelistData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      const isPaidUser = !!whitelistData;
      const finalPlanId = isPaidUser ? whitelistData.plan_id : 'trial';
      const finalStatus = isPaidUser ? whitelistData.payment_status : 'trialing';

      // 2. Anti-Abuse: verifica IP para novos usuários trial
      if (!isPaidUser && userIp) {
        const { data: ipData } = await supabase
          .from('users')
          .select('id')
          .eq('registration_ip', userIp)
          .eq('plan_id', 'trial')
          .limit(1);

        if (ipData && ipData.length > 0) {
          throw new Error('Um período de teste já foi utilizado nesta rede/dispositivo. Adquira um plano para continuar.');
        }
      }

      // 3. Cadastro no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: username } },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        if (!isPaidUser) {
          await supabase.from('users').insert({
            id: data.user.id,
            email,
            plan_id: finalPlanId,
            payment_status: finalStatus,
            registration_ip: userIp,
            activated_at: new Date().toISOString(),
          });
        } else {
          await supabase
            .from('users')
            .update({ id: data.user.id, registration_ip: userIp, activated_at: new Date().toISOString() })
            .eq('email', email);
        }

        setSuccess('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
        setUsername(''); setEmail(''); setPassword(''); setConfirmPassword(''); setAcceptedTerms(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-logo-section">
          <img src="/logo.png" alt="CentriCalc Logo" className="auth-main-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h1>Criar Conta</h1>
        </div>

        {error && <div className="auth-error-message">{error}</div>}
        {success && <div className="auth-success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input id="username" type="text" className="auth-input" placeholder="Seu nome" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" className="auth-input" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Senha</label>
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
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input id="confirm-password" type="password" className="auth-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <div className="auth-terms-group">
            <input type="checkbox" id="terms-checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            <label htmlFor="terms-checkbox">
              Li e concordo com os{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Termos de Uso</a>
            </label>
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            <span>Criar minha conta</span>
            {loading && <div className="auth-loading-spinner" />}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>Já tem uma conta? <Link to="/login">Entre aqui</Link></p>
        </div>
      </div>

      {showModal && (
        <div className="auth-modal" onClick={() => setShowModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h2>Termos de Uso</h2>
              <button className="auth-close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="auth-modal-body">
              <p>Bem-vindo ao <strong>CentriCalc</strong>. Ao utilizar nosso sistema, você concorda com os seguintes termos:</p>
              <h3>1. Período de Teste (Trial)</h3>
              <p>Oferecemos um período de teste gratuito de 14 dias para novos usuários. Após este prazo, o acesso às funcionalidades premium será bloqueado, exceto se houver a assinatura de um plano pago.</p>
              <h3>2. Política de Anti-Abuso</h3>
              <p>Para garantir a segurança e evitar o uso indevido de múltiplos períodos de teste, o sistema coleta e armazena o <strong>endereço IP</strong> utilizado no cadastro. Registros duplicados de teste originados da mesma rede poderão ser bloqueados automaticamente.</p>
              <h3>3. Responsabilidade técnica</h3>
              <p>O CentriCalc é uma ferramenta de auxílio ao dimensionamento. O usuário é o único responsável pelos dados inseridos e pela validação técnica dos resultados finais por um profissional habilitado.</p>
              <h3>4. Privacidade de Dados</h3>
              <p>Seus dados cadastrais e de acesso são utilizados estritamente para autenticação e melhoria do serviço, seguindo boas práticas de proteção de dados.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
