import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    if (isRegister) {
      const { error: err } = await signUp(email, password);
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        setInfo('Un email de confirmation a été envoyé. Vérifiez votre boîte de réception.');
      }
    } else {
      const { error: err } = await signIn(email, password);
      setLoading(false);
      if (err) {
        setError(err);
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
            {isRegister ? 'Créez votre compte administrateur' : 'Connectez-vous pour gérer vos produits'}
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
                required
                minLength={6}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-sans">{error}</p>}
          {info && <p className="text-sm text-[hsl(142,70%,40%)] font-sans">{info}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium"
          >
            {loading ? '...' : isRegister ? "S'inscrire" : 'Se connecter'}
          </Button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); setInfo(''); }}
          className="w-full text-center text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          {isRegister ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
        </button>
      </div>
    </main>
  );
};

export default AdminLogin;
