'use client';
import { use } from 'react';
import { LandingPresenter } from '../presenters/LandingPresenter';
import { CallbackPresenter } from '../presenters/CallbackPresenter';

export default function Home({ searchParams }) {
    // Handle legacy callback redirection to root
    // In Next.js 15+, searchParams is a promise that must be unwrapped
    const params: any = use(searchParams);
    const code = params?.code;

    if (code) {
        return <CallbackPresenter />;
    }

    return <LandingPresenter />;
}
