import { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { TfiTimer } from 'react-icons/tfi';

let date: Date = new Date(Date.now() + 60 * 20 * 1000);

const Timer = () => {
  const [presets, setPresets] = useState(20);
  const { minutes, seconds } = useTimer(date);

  const onStartTimer = () => {
    date = new Date(Date.now() + 60 * presets * 1000);
  };

  return (
    <section className="timer">
      <div className="timer_clock">
        <h4 className="show_timer">
          {minutes}:{seconds}
        </h4>
      </div>

      <div className="timer_presets">
        <h4>Presets</h4>
        <div>
          <div className="set_timer">
            <TfiTimer className="icon" />
            <button onClick={() => setPresets(50)}>50</button>
          </div>
          <div className="set_timer">
            <TfiTimer className="icon" />
            <button onClick={() => setPresets(30)}>30</button>
          </div>
          <div className="set_timer">
            <TfiTimer className="icon" />
            <button onClick={() => setPresets(40)}>40</button>
          </div>
        </div>
      </div>
      <button className="btn_timer" onClick={onStartTimer}>
        Start
      </button>
    </section>
  );
};
export default Timer;
