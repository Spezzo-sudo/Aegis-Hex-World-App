import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { signInWithEmail, signUpWithEmail } from '../services/authService';

type AuthMode = 'signin' | 'signup';

const AuthView: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = mode === 'signin'
            ? await signInWithEmail(email, password)
            : await signUpWithEmail(email, password);
        
        // FIX: Adjusted the condition to help TypeScript correctly narrow the discriminated union type of `result` and access the `error` property safely.
        if (result.success === false) {
            setError(result.error);
        }
        // On success, the onAuthStateChanged listener in App.tsx will handle the redirect.
        setIsLoading(false);
    };

    return (
        <div className="flex h-full w-full items-center justify-center animate-fade-in">
            <Card className="w-full max-w-md" titleClassName="text-center">
                 <div className="flex items-center justify-center space-x-2 p-4">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    <h1 className="text-2xl font-bold text-textHi tracking-widest">AEGIS HEX</h1>
                </div>
                <div className="flex border-b border-grid mb-4">
                    <button 
                        onClick={() => { setMode('signin'); setError(null); }}
                        className={`flex-1 p-3 font-semibold transition-colors ${mode === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-textHi'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => { setMode('signup'); setError(null); }}
                        className={`flex-1 p-3 font-semibold transition-colors ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-textHi'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-textMuted" htmlFor="email">Email Address</label>
                        <input 
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full bg-bg border border-grid rounded-md p-3 text-textHi focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="commander@aegis.net"
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-textMuted" htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 block w-full bg-bg border border-grid rounded-md p-3 text-textHi focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        {mode === 'signin' ? 'Access Terminal' : 'Establish Protocol'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default AuthView;