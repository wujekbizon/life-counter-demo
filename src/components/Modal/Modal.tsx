import { FaWindowClose } from 'react-icons/fa';
import { options, playerOptions } from '../../data/options';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { nanoid } from '@reduxjs/toolkit';
import Timer from '../Timer/Timer';

const Modal = () => {
  const {
    closeSideMenu,
    changeName,
    resetGame,
    setStartingLife,
    setNumberOfPlayers,
    setDefaultPlayers,
  } = useActions();
  const players = useTypedSelector((state) => state.player.players);

  const player = {
    playerId: nanoid(),
    playerLife: 20,
    playerName: 'DefaultPlayer',
  };

  const onResetHandler = () => {
    resetGame();
    closeSideMenu();
  };

  const onAddPlayersHandler: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const numPlayers = parseInt(e.target.value);

    if (numPlayers === 2) {
      setDefaultPlayers();
      return;
    }

    if (numPlayers >= 3) {
      setDefaultPlayers();
      setNumberOfPlayers({
        multiplier: numPlayers,
        player,
      });
    }
  };

  return (
    <aside className="modal">
      <div className="modal_left">
        {players.map(({ playerId, playerName }) => (
          <div className="modal_inputs" key={playerId}>
            <label htmlFor={playerId}>{playerName}</label>
            <input
              type="text"
              id={playerId}
              value={playerName}
              onChange={(e) =>
                changeName({ id: playerId, name: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      <div className="modal_right">
        <div className="modal_settings">
          <button className="btn_reset" onClick={onResetHandler}>
            Reset
          </button>
          <label htmlFor="life">Starting Life</label>
          <select
            id="life"
            onChange={(e) =>
              setStartingLife({ life: parseInt(e.target.value) })
            }
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="#players">How many players</label>
          <select id="#players" onChange={(e) => onAddPlayersHandler(e)}>
            {playerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        <Timer />
      </div>

      <button className="btn_menu-close" onClick={() => closeSideMenu()}>
        {' '}
        <FaWindowClose className="close_icon" />
      </button>
    </aside>
  );
};
export default Modal;
