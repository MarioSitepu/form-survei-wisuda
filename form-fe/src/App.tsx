import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import AdminLink from './pages/AdminLink';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminLink />} />
        <Route path="/admin-7x8k9m2q" element={<AdminPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

