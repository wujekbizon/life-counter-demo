import { useEffect } from 'react'
import Settings from './components/Settings/Settings'
import Card from './components/PlayerCard/Card'
import Modal from './components/Modal/Modal'
import { useTypedSelector } from './hooks/useTypedSelector'
import React from 'react'
import Event from './components/Event/Event'

// declare const window: Window &
//   typeof globalThis & {
//     __args: {
//       argv: string[]
//       config: Config
//       debug: number
//       env: {
//         USER: string
//         TMPDIR: string
//         PWD: string
//       }
//       index: number
//     }
//   }

const App = () => {
  const isMenuOpen = useTypedSelector((state) => state.modal.isMenuOpen)
  const players = useTypedSelector((state) => state.player.players)

  // const onKeyPressReload = (e: KeyboardEvent) => {
  //   if (e.key === 'Alt' && window.__args.debug && window.__args.config.build_redirect) {
  //     window.location = window.__args.config.build_redirect
  //   }
  // }

  // useEffect(() => {
  //   addEventListener('keydown', onKeyPressReload)

  //   return () => {
  //     removeEventListener('keydown', onKeyPressReload)
  //   }
  // }, [onKeyPressReload])

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
