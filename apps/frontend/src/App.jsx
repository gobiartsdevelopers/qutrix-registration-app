import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/register',
            element: <Register />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <Toaster />
        </>
    );
}

export default App;
