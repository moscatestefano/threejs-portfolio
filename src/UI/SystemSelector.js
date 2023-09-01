import useSpaceLobby from '../stores/useSpaceLobby'

import { useRef, useEffect } from 'react'

export default function SystemSelector({ ...props })
{
    const toggleRef = useRef(null)

    const isPanelOpen = useSpaceLobby(state => state.isPanelOpen)
    const isPlanetInspected = useSpaceLobby(state => state.planetInspected)
    const isSwitchToggled = useSpaceLobby(state => state.isSwitchToggled)
    
    const toggleSwitch = useSpaceLobby(state => state.toggleSwitch)
    
    document.addEventListener('jumpStarted', (e) => manageToggle(true), {once: true})
    document.addEventListener('jumpFinished', (e) => manageToggle(false), {once: true})
    
    
    const manageSwitch = () => {
        if (toggleRef)
        toggleSwitch()
    }   

    useEffect(() =>{
        if (toggleRef && !isPanelOpen && !isPlanetInspected)
        toggleRef.current.checked = isSwitchToggled
    }, [isSwitchToggled, isPanelOpen, isPlanetInspected]) // check if you can reduce or skip the effect

    const manageToggle = newCondition => {
        if (toggleRef) 
        {
            setTimeout(() => {
                toggleRef.current.disabled = newCondition
            }, 500)
        }
    }
    return <>
            {(!isPanelOpen && !isPlanetInspected) && <div className="slider">
            <input ref={toggleRef} onClick={() => manageSwitch()} type="checkbox" className="slider-checkbox solarSystem" id="sliderSwitch" draggable="false" />
            <label className="slider-label" htmlFor="sliderSwitch">
                <span className="slider-inner" />
                <span className="slider-circle" />
            </label>
        </div>}
    </>
}