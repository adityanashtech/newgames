import GameGrid from './components/GameGrid'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">JDB Games Game Collection</h1>
      <GameGrid />
    </main>
  )
}

