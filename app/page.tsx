import Navbar from '@components/Navbar/Navbar';
import Hero from '@components/Hero/Hero';

export default function Home() {
  return (
    <>
        <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300 z-50">
            <Navbar />
        </nav>

        <section className=" bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
            <Hero />
        </section>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </>
  );
}
