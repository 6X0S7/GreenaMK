import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturedListings />
    </main>
  );
}
