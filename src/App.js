import React from 'react'
import {Grommet, Button} from 'grommet'
import { Start, Join } from './bot'

export default function App(){
  return (
    <Grommet>
      <Button onClick={() => Join()} label="Join"></Button>
      <Button onClick={() => Start()} label="Start"></Button>
    </Grommet>
  )
}