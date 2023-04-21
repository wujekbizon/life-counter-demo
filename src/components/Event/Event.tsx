import { Peer } from 'socket:peer'
import process from 'socket:process'
import Buffer from 'socket:buffer'
import fs from 'socket:fs'

const Event = () => {
  window.onload = async () => {
    const clusterId = '14ecd42...' // truncated, make your own clusterId
    const publicKeyHex = 'c43c1ddd...' // truncated, make your own hex encoded key
    const privateKeyHex = '46adc2f8e9077c72...' // truncated, make your own hex encoded key

    const publicKey = Buffer.from(publicKeyHex, 'hex').buffer
    const privateKey = Buffer.from(privateKeyHex, 'hex').buffer

    let peerId = '111e0b848d77d7b3d778187d006056ee406221ca567ce2844ca403dc834ff8f1'

    if (process.platform === 'darwin') {
      peerId = '222d38de5b1e4b557a446401317eb02c6d1a0287959529972245159e79861567'
    }

    const peer = new Peer({ peerId, publicKey, privateKey, clusterId })
    window.peer = peer
    console.log('created peer')

    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')

    const setSize = () => {
      canvas.width = document.body.offsetWidth
      canvas.height = document.body.offsetHeight
    }

    setSize()
    window.addEventListener('resize', setSize)

    let isDrawing = false
    let x = 0
    let y = 0

    function drawLine(context, color, x1, y1, x2, y2) {
      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = 1
      context.moveTo(x1, y1)
      context.lineTo(x2, y2)
      context.stroke()
      context.closePath()
    }

    const network = await peer.join()

    const getOffset = (e) => {
      if (e.offsetX) return { offsetX: e.offsetX, offsetY: e.offsetY }
      if (!e.targetTouches[0]) return { offsetX: 0, offsetY: 0 }

      const rect = e.target.getBoundingClientRect()

      return {
        offsetX: e.changedTouches[0]?.pageX - rect.left,
        offsetY: e.changedTouches[0]?.pageY - rect.top
      }
    }

    const penDown = (e) => {
      isDrawing = true
      const o = getOffset(e)
      x = o.offsetX
      y = o.offsetY
    }

    const penUp = (e) => {
      if (!isDrawing) return
      const o = getOffset(e)
      if (o.offsetX <= 0) return
      if (o.offsetY <= 0) return

      drawLine(context, 'black', x, y, o.offsetX, o.offsetY)
      x = o.offsetX
      y = o.offsetY
      isDrawing = false
    }

    const penMove = (e) => {
      if (!isDrawing) return
      const o = getOffset(e)
      drawLine(context, 'black', x, y, o.offsetX, o.offsetY)
      const value = { x1: x, y1: y, x2: o.offsetX, y2: o.offsetY }
      const data = new Buffer.from(JSON.stringify(value))

      if (o.offsetX > 0) x = o.offsetX
      if (o.offsetY > 0) y = o.offsetY

      for (const remotePeer of network.peers) {
        //
        // only send this to peers in my cluster because they are the
        // only peers who will know who to accept this kind of message.
        //
        if (remotePeer.clusterId !== clusterId) continue
        network.send(data, remotePeer.port, remotePeer.address)
      }
    }

    canvas.addEventListener('touchstart', penDown)
    canvas.addEventListener('mousedown', penDown)

    canvas.addEventListener('touchend', penUp)
    canvas.addEventListener('mouseup', penUp)

    canvas.addEventListener('touchmove', penMove)
    canvas.addEventListener('mousemove', penMove)

    network.onConnect = (...args) => {
      console.log(network.peerId, network.address, network.port, 'CONNECT', ...args)
    }

    network.onData = (packet, port, address, data) => {
      if (packet.type) return

      try {
        const { x1, y1, x2, y2 } = JSON.parse(data)
        drawLine(context, 'black', x1, y1, x2, y2)
      } catch (err) {
        console.error(err)
      }
    }
  }
  return <div>Event</div>
}
export default Event
