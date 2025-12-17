'use client';
import { use } from 'react';
import { LandingPresenter } from '../presenters/LandingPresenter';
import { CallbackPresenter } from '../presenters/CallbackPresenter';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Home({ searchParams }: PageProps) {
    // Handle legacy callback redirection to root
    // In Next.js 15+, searchParams is a promise that must be unwrapped
    const params = use(searchParams);
    const code = params?.code;

    if (code) {
        return <CallbackPresenter />;
    }

    return <LandingPresenter />;
}
