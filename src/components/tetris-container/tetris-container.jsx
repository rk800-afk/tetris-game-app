import { useState, useEffect, useRef } from "react"
import "./tetris-container.css"
import { TetrisElement } from "../tetris-element/tetris-element"

const GAME_FIELD = Array.from({ length: 20 }, () => Array(10).fill(0))
const GAME_BLOCKS = {
  line: {
    type: "line",
    schema: {
      rotation0: [[1, 1, 1, 1]],
      rotation90: [[1], [1], [1], [1]],
      rotation180: [[1, 1, 1, 1]],
      rotation270: [[1], [1], [1], [1]],
    },
    shift: 1,
  },
  snake: {
    type: "snake",
    schema: {
      rotation0: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      rotation90: [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
      rotation180: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      rotation270: [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    },
    shift: 0,
  },
  snakeReverse: {
    type: "snakeReverse",
    schema: {
      rotation0: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      rotation90: [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      rotation180: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      rotation270: [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    },
    shift: 0,
  },
  square: {
    type: "square",
    schema: {
      rotation0: [
        [1, 1],
        [1, 1],
      ],
      rotation90: [
        [1, 1],
        [1, 1],
      ],
      rotation180: [
        [1, 1],
        [1, 1],
      ],
      rotation270: [
        [1, 1],
        [1, 1],
      ],
    },
    shift: 0,
  },
  letterL: {
    type: "letterL",
    schema: {
      rotation0: [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
      rotation90: [
        [1, 1, 1],
        [1, 0, 0],
      ],
      rotation180: [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
      rotation270: [
        [0, 0, 1],
        [1, 1, 1],
      ],
    },
    shift: 0,
  },
  letterG: {
    type: "letterG",
    schema: {
      rotation0: [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      rotation90: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      rotation180: [
        [1, 1],
        [1, 0],
        [1, 0],
      ],
      rotation270: [
        [1, 1, 1],
        [0, 0, 1],
      ],
    },
    shift: 0,
  },
  letterT: {
    type: "letterT",
    schema: {
      rotation0: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      rotation90: [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
      rotation180: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      rotation270: [
        [1, 0],
        [1, 1],
        [1, 0],
      ],
    },
    shift: 0,
  },
}

const placeInField = (
  type,
  gameField,
  posX,
  posY,
  rot = "rotation0",
  clear = false
) => {
  // debugger
  const schema = GAME_BLOCKS[type].schema[rot]

  const fieldCopy = [...gameField]
  for (let i = 0; i < fieldCopy.length; i++) {
    fieldCopy[i] = [...gameField[i]]
  }

  for (let i = 0; i < schema.length; i++) {
    for (let j = 0; j < schema[i].length; j++) {
      if (gameField[i + posY][j + posX] === 1 && schema[i][j] === 1 && !clear)
        return gameField
      if (posX + schema[i].length > 9 + 1) return gameField
      if (posY + schema.length > 20) return gameField

      if (schema[i][j] === 1) {
        if (!clear) {
          fieldCopy[i + posY][j + posX] = 1
        } else {
          fieldCopy[i + posY][j + posX] = 0
        }
      }
    }
  }

  return fieldCopy
}

export function TetrisContainer() {
  const [gameField, setGameField] = useState(GAME_FIELD)
  const [score, setScore] = useState(0)
  const [fallToggle, setFallToggle] = useState(true)
  const [nextFigures, setNextFigures] = useState(() => {
    const mas = []
    for (let i = 0; i < 4; i++) {
      mas.push(
        Object.keys(GAME_BLOCKS)[
          Math.floor(Math.random() * Object.keys(GAME_BLOCKS).length)
        ]
      )
    }

    return mas
  })

  const activeFigure = useRef({
    posX: 0,
    posY: 0,
    type: Object.keys(GAME_BLOCKS)[
      Math.floor(Math.random() * Object.keys(GAME_BLOCKS).length)
    ],
    rot: "rotation0",
  })

  useEffect(() => {
    let intervalId

    console.log(nextFigures)

    const spawnFigure = () => {
      debugger
      setFallToggle((prev) => !prev)
      activeFigure.current.posX = 3
      activeFigure.current.posY = 0

      setNextFigures((prev) => {
        activeFigure.current.type = prev[0]
        const newFigures = [...prev]
        newFigures.shift()
        newFigures.push(
          Object.keys(GAME_BLOCKS)[
            Math.floor(Math.random() * Object.keys(GAME_BLOCKS).length)
          ]
        )
        return newFigures
      })

      setGameField((prev) => {
        const { posX, posY, type, rot } = activeFigure.current
        return placeInField(type, prev, posX, posY, rot, false)
      })
    }

    intervalId = setInterval(() => {
      setGameField((prev) => {
        const { posX, posY, rot, type } = activeFigure.current
        if (posY + GAME_BLOCKS[type].schema[rot].length + 1 < 21) {
          const clenedField = placeInField(type, prev, posX, posY, rot, true)

          const placedField = placeInField(
            type,
            clenedField,
            posX,
            posY + 1,
            rot,
            false
          )

          if (!compareArrays(placedField, clenedField)) {
            activeFigure.current.posY += 1
            return placedField
          } else {
            spawnFigure()
            return prev
          }
        }

        spawnFigure()
        return prev
      })
    }, 1000)

    setGameField((prev) => {
      return placeInField(
        activeFigure.current.type,
        prev,
        activeFigure.current.posX,
        activeFigure.current.posY,
        activeFigure.current.rot,
        false
      )
    })

    document.addEventListener("keydown", (event) => {
      console.log(event)
      if (event.key === "ArrowLeft") {
        setGameField((prev) => {
          const { posX, posY, rot, type } = activeFigure.current

          if (posX - 1 >= 0) {
            const clenedField = placeInField(type, prev, posX, posY, rot, true)
            const placedField = placeInField(
              type,
              clenedField,
              posX - 1,
              posY,
              rot,
              false
            )

            if (!compareArrays(placedField, clenedField)) {
              activeFigure.current.posX -= 1
              return placedField
            } else {
              return prev
            }
          }
          return prev
        })
      } else if (event.key === "ArrowRight") {
        setGameField((prev) => {
          const { posX, posY, rot, type } = activeFigure.current

          if (posX + GAME_BLOCKS[type].schema[rot][0].length + 1 < 11) {
            const clenedField = placeInField(type, prev, posX, posY, rot, true)
            const placedField = placeInField(
              type,
              clenedField,
              posX + 1,
              posY,
              rot,
              false
            )

            if (!compareArrays(placedField, clenedField)) {
              activeFigure.current.posX += 1
              return placedField
            } else {
              return prev
            }
          }
          return prev
        })
      } else if (event.key === "ArrowDown") {
        setGameField((prev) => {
          const { posX, posY, rot, type } = activeFigure.current
          if (posY + GAME_BLOCKS[type].schema[rot].length + 1 < 21) {
            const clenedField = placeInField(type, prev, posX, posY, rot, true)
            const placedField = placeInField(
              type,
              clenedField,
              posX,
              posY + 1,
              rot,
              false
            )

            if (!compareArrays(placedField, clenedField)) {
              activeFigure.current.posY += 1
              return placedField
            } else {
              spawnFigure()
              return prev
            }
          }

          spawnFigure()
          return prev
        })
      } else if (event.code === "KeyR") {
        setGameField((prev) => {
          const { posX, posY, rot, type } = activeFigure.current
          if (
            (rot === "rotation90" || rot === "rotation270") &&
            posX - GAME_BLOCKS[type].shift < 0
          ) {
            return prev
          }

          debugger
          const newRot =
            rot === "rotation0"
              ? "rotation90"
              : rot === "rotation90"
              ? "rotation180"
              : rot === "rotation180"
              ? "rotation270"
              : rot === "rotation270"
              ? "rotation0"
              : "error"

          const clenedField = placeInField(type, prev, posX, posY, rot, true)

          let newPosX
          if (newRot === "rotation90" || newRot === "rotation270") {
            newPosX = posX + GAME_BLOCKS[type].shift
          } else {
            newPosX = posX - GAME_BLOCKS[type].shift
          }

          const placedField = placeInField(
            type,
            clenedField,
            newPosX,
            posY,
            newRot,
            false
          )

          if (!compareArrays(placedField, clenedField)) {
            activeFigure.current.rot = newRot
            activeFigure.current.posX = newPosX
            return placedField
          } else {
            return prev
          }
        })
      }
    })

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const onesRows = []
    const { posX, posY, rot, type } = activeFigure.current
    // const endX = GAME_BLOCKS[type].schema[rot][0].length + posX
    const endY = GAME_BLOCKS[type].schema[rot].length + posY

    for (let i = 0; i < gameField.length; i++) {
      if (gameField[i].every((num) => num === 1)) {
        onesRows.push(i)
      }
    }

    if (onesRows.length === 0) {
      return
    }

    const newField = gameField.filter((_, index) => !onesRows.includes(index))
    for (let i = 0; i < onesRows.length; i++) {
      // newField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      newField.splice(endY, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }

    setGameField(newField)
    setScore((prev) => prev + onesRows.length * 100)
  }, [fallToggle])

  return (
    <div className='tetris-container'>
      <div>
        <div className='tetris-scope-container'>
          <p>Current scope:</p>
          <p className='tetris-scope-count'>{score}</p>
        </div>
        <div className='tetris-field'>
          {gameField.map((string, index) => {
            return string.map((val, index2) => {
              return <FieldCell key={`${index}${index2}`} value={val} />
            })
          })}
        </div>
      </div>
      <div className='tetris-next-container'>
        <p>Next elements:</p>
        <div className='tetris-next-container-content'>
          {nextFigures.map((figure, index) => {
            return (
              <NextFigure
                key={`${figure}${index}`}
                schema={GAME_BLOCKS[figure].schema.rotation0}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function NextFigure({ schema }) {
  return (
    <div className='next-figure-container'>
      {schema.map((row, index) => {
        return (
          <div key={index} className='next-figure-container-row'>
            {row.map((val, index2) => {
              return (
                <div
                  key={`${index}${index2}next`}
                  className={`emplty-cell ${val === 1 ? "tetris-block" : ""}`}
                ></div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function FieldCell({ value }) {
  return (
    <div className={`field-cell ${value === 1 ? "tetris-block" : ""}`}></div>
  )
}

function compareArrays(arr1, arr2) {
  let isSimple = true
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        isSimple = false
        break
      }
    }
    if (!isSimple) {
      break
    }
  }
  return isSimple
}
