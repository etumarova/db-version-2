import React from 'react';
import Dashboard from './components/Dashboard';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'features/queryClient';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );
}

export default App;
