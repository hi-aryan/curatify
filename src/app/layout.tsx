import './globals.css';
import StoreProvider from './StoreProvider';
import AppInitializer from './AppInitializer';

export const metadata = {
    title: 'Curatify',
    description: 'Spotify Dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <StoreProvider>
                    <AppInitializer>
                        {children}
                    </AppInitializer>
                </StoreProvider>
            </body>
        </html>
    );
}
