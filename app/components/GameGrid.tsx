import GameCard from './GameCard';
import gameJDBdata from '../../data/jdb.json';

export default function GameGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gameJDBdata.map((game) => (
        <GameCard
          key={game.game_uid}
          title={game.game_name}
          image={game.icon}
          game_uid={game.game_uid}
        />
      ))}
    </div>
  );
}
