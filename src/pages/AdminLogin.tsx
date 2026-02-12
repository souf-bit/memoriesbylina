import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
      });
      setLoading(false);
      if (err) {
        setError(err.message);
      } else {
        setError('');
        setMode('login');
        // Auto-confirm is enabled, so we can login immediately
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) {
          setError(loginErr.message);
        } else {
          navigate('/admin');
        }
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (err) {
        setError(err.message);
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            {mode === 'login'
              ? 'Connectez-vous avec votre email et mot de passe'
              : 'Créez votre compte administrateur'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-sans uppercase tracking-wider">Email</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ps-10 rounded-none"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-sans uppercase tracking-wider">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10 rounded-none"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-sans">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium"
          >
            {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </Button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="w-full text-center text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === 'login' ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
