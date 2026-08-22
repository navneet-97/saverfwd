import Header from './Header';
import './AppLayout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
