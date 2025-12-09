'use client';
import { useRouter } from 'next/navigation';
import { AboutView } from '../views/AboutView.jsx';

export function AboutPresenter() {
    const router = useRouter();

    function navigateToHomeACB() {
        router.push('/dashboard');
    }

    return (
        <AboutView
            onNavigateToHome={navigateToHomeACB}
        />
    );
}
