import "./tetris-element.css"

export function TetrisElement() {
  return (
    <div className='tetris-element'>
      <TetrisBlock />
      <TetrisBlock />
      <TetrisBlock />
      <TetrisBlock />
    </div>
  )
}

function TetrisBlock() {
  return <div className='tetris-block'></div>
}
