import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Greena',
  description: 'Greena marketplace for local buying, renting and offers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
