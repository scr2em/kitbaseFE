import { RouterProvider } from 'react-router';
import { router } from './app/routes';
import './shared/i18n/config';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
