import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import LaunchPage from './pages/LaunchPage.jsx';
import MakerPage from './pages/MakerPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SubmitPage from './pages/SubmitPage.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics/:topic" element={<HomePage />} />
          <Route path="/launches/:slug" element={<LaunchPage />} />
          <Route path="/makers/:handle" element={<MakerPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="*" element={<p className="empty">Nothing docked here.</p>} />
        </Routes>
      </main>
    </>
  );
}
