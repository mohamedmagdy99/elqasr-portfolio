import Navbar from '@components/Navbar/Navbar';
export default function Home() {
  return (
    <>
        <div className="min-h-screen bg-white">
            <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300  ">
                <Navbar/>
            </nav>
        </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </>
  );
}
