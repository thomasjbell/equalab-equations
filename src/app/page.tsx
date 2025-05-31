import EquationGrid from '../components/EquationGrid'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <EquationGrid />
      </div>
    </main>
  )
}