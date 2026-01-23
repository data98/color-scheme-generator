import ColorGenerator from '@/components/ColorGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0e] selection:bg-[#4e42f9] selection:text-white transition-colors duration-1000">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4e42f9]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#4e42f9]/5 blur-[100px] rounded-full" />
      </div>

      <ColorGenerator />
    </main>
  );
}
