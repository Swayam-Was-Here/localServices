import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      const userId = data.user.id;
      
      // Check if user is a consumer
      const { data: consumer } = await supabase.from('consumers').select('id').eq('id', userId).maybeSingle();
      if (consumer) {
        navigate('/dashboard');
        return;
      }
      
      // Check if user is a provider
      const { data: provider } = await supabase.from('service_providers').select('id, status').eq('id', userId).maybeSingle();
      if (provider) {
        if (provider.status === 'pending') {
           navigate('/pending-approval');
        } else {
           navigate('/provider-dashboard');
        }
        return;
      }
      
      // Default fallback (e.g. for Admin or unknown roles)
      navigate('/admin'); 
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '450px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Welcome Back</h2>
        
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', padding: '0.75rem', background: '#ffe4e6', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--outline-variant)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--outline-variant)' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: 'var(--primary)', 
                color: 'var(--on-primary)', 
                borderRadius: 'var(--radius-sm)', 
                fontWeight: 'bold',
                fontSize: '1rem'
            }}
            className="neon-glow-hover"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--tertiary)', fontWeight: 'bold' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
