import Settings from './components/Settings/Settings'
import Card from './components/PlayerCard/Card'
import Modal from './components/Modal/Modal'
import { useTypedSelector } from './hooks/useTypedSelector'
import Event from './components/Event/Event'

import React from 'react'

const App = () => {
  const isMenuOpen = useTypedSelector((state) => state.modal.isMenuOpen)
  const players = useTypedSelector((state) => state.player.players)

  return (
    <main className="app">
      <div className="settings_container">
        <Settings />
      </div>
      <Event />
      <div className="cards_contanier">
        {players.map((player) => (
          <Card {...player} key={player.playerId} />
        ))}
      </div>
      {isMenuOpen && <Modal />}
    </main>
  )
}
export default App
