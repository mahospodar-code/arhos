import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import { Grain, GridGuides } from './components/ui';
import Home from './pages/Home';
import ProjectPage from './pages/Project';
import Admin from './pages/Admin';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <GridGuides />
      <Grain />
      <Nav />
      <main className="relative z-10">{children}</main>
      <Footer />
      <MobileCTA />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <SiteLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projekt/:id" element={<ProjectPage />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </SiteLayout>
          }
        />
      </Routes>
    </>
  );
}
