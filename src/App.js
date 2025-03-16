import HubScene from './HubScene.js'
import CannonMinigame from './CannonMinigame.js'

import { Analytics } from '@vercel/analytics/react'

import { Route } from 'wouter'


export default function App({ ...props })
{
    return <>
      <Route path='/'>
        <HubScene />
      </Route>
      <Route path='/lbl-minigame'>
        <CannonMinigame />
      </Route>
      <Route path='/lma-minigame'>
          {/* <HubScene /> */}
      </Route>
      <Route path='/lno-minigame'>
          {/* <HubScene /> */}
      </Route>
      <Route path='/lbo-minigame'>
          {/* <HubScene /> */}
      </Route>
      <Route path='/pex-minigame'>
          {/* <HubScene /> */}
      </Route>
      <Route path='/ptr-minigame'>
          {/* <HubScene /> */}
      </Route>
      {/* <Analytics /> */}
    </>
}