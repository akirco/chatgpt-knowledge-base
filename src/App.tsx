import router from './router';
import { RouterProvider } from 'react-router-dom';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ThemeToggleButton />
    </>
  );
}

export default App;
