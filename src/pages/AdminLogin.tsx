import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setInfo('Un code de vérification a été envoyé à votre email.');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            {step === 'email'
              ? 'Entrez votre email pour recevoir un code de vérification'
              : `Code envoyé à ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
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

            {error && <p className="text-sm text-destructive font-sans">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium"
            >
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs font-sans uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5" />
                Code de vérification
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-sans">{error}</p>}
            {info && <p className="text-sm text-[hsl(142,70%,40%)] font-sans">{info}</p>}

            <Button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full rounded-none py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </Button>

            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); setInfo(''); }}
              className="w-full text-center text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              Changer d'email
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminLogin;
