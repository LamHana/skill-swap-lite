import { BrowserRouter, HashRouter } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import Router from './Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AppRouter =
    import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter;
const queryClient = new QueryClient();
export default function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AppRouter>
                    <Router />
                </AppRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
