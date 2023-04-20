import { TiThMenuOutline } from 'react-icons/ti';
import { useActions } from '../../hooks/useActions';
import os from 'socket:os';

const Settings = () => {
  const { openSideMenu } = useActions();

  return (
    <nav className="settings_container">
      <div className="settings">
        <TiThMenuOutline className="menu_icon" onClick={() => openSideMenu()} />
      </div>
      <h1>Your operation system is {os.platform()}</h1>
    </nav>
  );
};
export default Settings;
