
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-tier-3">Operational Command Center</p>
          </div>
        </div>

        <p className="text-tier-2 text-[14px] font-medium leading-relaxed">
          Access the strategic execution engine for multi-channel expansion and performance tracking.
        </p>

        <Button 
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-[13px] uppercase tracking-wider shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebase/anonymous-scan.png" alt="Google" className="size-5 grayscale invert" />
          Authenticate with Google
        </Button>

        <div className="flex flex-col gap-2 mt-4 opacity-40">
          <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">Secure Mission Access</span>
          <div className="h-px w-20 bg-white/10 mx-auto" />
        </div>
      </div>
    </div>
  );
}
