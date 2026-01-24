import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage from './pages/ArticlePage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import AdminPage from './pages/AdminPage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import PolitiqueConfidentialitePage from './pages/PolitiqueConfidentialitePage';
import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="articles" element={<ArticlesListPage />} />
            <Route path="articles/:slug" element={<ArticlePage />} />
            <Route path="evenements" element={<EventsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <CookieBanner />
      </Router>
    </AuthProvider>
  );
}

export default App;
