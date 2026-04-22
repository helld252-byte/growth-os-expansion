
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const { auth, firestore } = { auth: useAuth(), firestore: useFirestore() };
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync user profile to Firestore
      const userRef = doc(firestore, 'users', user.uid);
      setDoc(userRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });

    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Zap className="size-12 text-primary fill-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-4">Initializing Unit-01</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full premium-panel p-10 rounded-3xl flex flex-col items-center gap-10 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex flex-col items-center gap-6">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/10">
            <Zap className="size-8 text-white fill-white" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter text-tier-1">Growth OS</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-2">Operational Command Center</p>
          </div>
        </div>

        <p className="text-tier-2 text-[14px] font-medium leading-relaxed">
          Access the strategic execution engine for multi-channel expansion and performance tracking.
        </p>

        <Button 
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-[13px] uppercase tracking-wider shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="size-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Authenticate with Google
        </Button>

        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-tier-3">Secure Mission Access</span>
          <div className="h-px w-20 bg-white/10 mx-auto" />
        </div>
      </div>
    </div>
  );
}
