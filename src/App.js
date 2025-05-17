import HubScene from './HubScene.js'
import CannonGame from './games/CannonGame/CannonGame.js'
import NotFound from './NotFound.js'

import { Analytics } from '@vercel/analytics/react'

import { Route } from 'wouter'


export default function App({ ...props })
{
    return <>
      <Route path='/'>
        <HubScene />
      </Route>
      <Route path='/ban-lonnac'>
        <NotFound />
      </Route>
      <Route path='/exo'> 
        <NotFound />
      </Route>
      <Route path='/trantor'> 
        <NotFound />
      </Route>
      <Route path='/makkuro'> 
        <NotFound />
      </Route>
      <Route path='/nobonia'> 
        <NotFound />
      </Route>
      <Route path='/boros'> 
        <NotFound />
      </Route>
      <Analytics />
    </>
}