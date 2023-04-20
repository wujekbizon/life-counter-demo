import { useEffect } from 'react';
import { GiHeartMinus, GiHeartPlus } from 'react-icons/gi';
import { BsShieldFillMinus, BsShieldFillPlus } from 'react-icons/bs';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface Player {
  playerId: string;
  playerLife: number;
  playerName: string;
}

const Card = ({ playerLife, playerName, playerId }: Player) => {
  const {
    addLife,
    subtractLife,
    subtractLifeByAmount,
    addLifeByAmount,
    setGameOver,
  } = useActions();
  const isGameOver = useTypedSelector((state) => state.player.isGameOver);

  useEffect(() => {
    if (playerLife <= 0) {
      setGameOver({ id: playerId });
    }
  }, [playerLife]);

  return (
    <section className={`${isGameOver && playerLife === 0 && 'lost'}  card`}>
      <div className="player_name">
        <h2>{playerName}</h2>
      </div>
      <div className="player_life">
        <h1>{playerLife}</h1>
      </div>
      <div className="player_buttons">
        <div className="sub_btns">
          <button
            onClick={() => subtractLife({ id: playerId })}
            className="btn_danger"
            disabled={playerLife === 0}
          >
            <GiHeartMinus className="icon" />
          </button>
          <button
            className="btn_danger"
            onClick={() => subtractLifeByAmount({ id: playerId, amount: 5 })}
            disabled={playerLife === 0}
          >
            <BsShieldFillMinus className="icon" />
          </button>
        </div>
        <div className="add_btns">
          <button
            onClick={() => addLife({ id: playerId })}
            className="btn_success"
            disabled={playerLife === 0}
          >
            <GiHeartPlus className="icon" />
          </button>
          <button
            className="btn_success"
            disabled={playerLife === 0}
            onClick={() => addLifeByAmount({ id: playerId, amount: 5 })}
          >
            <BsShieldFillPlus className="icon" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default Card;
