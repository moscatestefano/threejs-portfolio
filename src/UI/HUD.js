import useSpaceLobby from '../stores/useSpaceLobby'
import PlanetSidePanel from './PlanetSidePanel'
import GeneralInfoPanel from './GeneralInfoPanel'
import SystemSelector from './SystemSelector'
import PleaseRotate from './PleaseRotate'

import { useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function UI_HUD()
{
    /*
        Info panel link [Lower:Left]
        Galaxy switch [Upper:Center]
        Planet Side Panel [Right]
    */

    const isPanelOpen = useSpaceLobby(state => state.isPanelOpen)
    const isPlanetInspected = useSpaceLobby(state => state.planetInspected)
    const isJumping = useSpaceLobby(state => state.isJumping)
    
    const togglePanel = useSpaceLobby(state => state.togglePanel)

    const itemAudio = useMemo(() => new Audio('./sfx/flagreturn.wav'), [])
    itemAudio.volume = 0.3

    useEffect(() => {
        if (isPlanetInspected && isPanelOpen)
            togglePanel()
    }, [isPlanetInspected])

    useEffect(() => {
        if (isPanelOpen)
        itemAudio.play()
    }, [isPanelOpen])

        return <>
                {(!isJumping && !isPlanetInspected) && <img alt="main panel info button" id="panelToggle" src="./infobtn.png" width="50px" height="50px" draggable="false" onClick={togglePanel} />}
                <ErrorBoundary fallback={<div>An issue occured. Please reload the application.</div>}>
                    <SystemSelector />
                </ErrorBoundary>
                {isPanelOpen && <GeneralInfoPanel />}
                <PlanetSidePanel />
                <PleaseRotate />
            </>
}