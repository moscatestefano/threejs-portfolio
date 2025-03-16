import useSpaceLobby from "../stores/useSpaceLobby"

import { useRef, useEffect, useMemo } from 'react'

import LorePanel from "./LorePanel"
import uiJson from '../assets/text/en/ui.json'

import { useLocation } from 'wouter'

export default function PlanetSidePanel(props)
{

    const panelRef = useRef()

    const isPlanetInspected = useSpaceLobby(state => state.planetInspected)
    const planetProps = useSpaceLobby(state => state.currentPlanetProps)

    const [ location, setLocation ] = useLocation()

    const audioItem = useMemo(() => new Audio('./sfx/itemback.wav'))

    useEffect(() => {
        openNavBar()
    }, [isPlanetInspected])

    // const toggleNavBar = () =>
    // {
    //     if (isPlanetInspected)
    //         panelRef.current.style.width = "31%"
    //     else
    //         panelRef.current.style.width = "0"
    // }

    const openNavBar = () =>
    {
        if (isPlanetInspected)
        {
            panelRef.current.style.width = "35%"
            panelRef.current.style.border = "2px solid hsl(183, 100%, 35%)"
            audioItem.play()
        }
        else
            closeNavBar()
    }

    const closeNavBar = () =>
    {
        panelRef.current.style.width = "0"
        if (isPlanetInspected)
            useSpaceLobby.setState({ planetInspected: false, planetObjectRef: undefined, currentPlanetProps: undefined })
        panelRef.current.style.border = "0px"
    }

    return <>
        <div ref={panelRef} id="planetsidepanel" className="sidePanel">
            <div className="closebtn" onClick={() => closeNavBar()}>&times;</div>
            <div id="planetinfocontainer">
                    <h1><span className="specifier">planet </span>{planetProps?.name}</h1>
                <div id="planetinfodetails">
                    <div>
                        <span className="specifier">project </span>
                        <a href={planetProps?.link} target="_blank">{planetProps?.project}</a>
                    </div>
                    <div>
                        <span className="specifier">year </span>
                        {planetProps?.year}
                    </div>
                    <div>
                        {
                            planetProps?.client === "" ?
                            <span className="specifier">publisher </span> :
                            <span className="specifier">client </span>
                        }
                        {planetProps?.client === "" ? 
                            planetProps?.publisher :
                            planetProps?.client}
                    </div>
                    <div>
                    <span className="specifier">elements found </span>
                    <ul>{planetProps?.elements.map((el, i) => <li key={i}>{el}  <img src={uiJson["icons"][planetProps?.elementsTag[i]]}/></li>)}</ul>
                    </div>
                    <div>
                        <span className="specifier">readings </span><br />
                        {planetProps?.flavor}
                    </div>
                    <LorePanel description={planetProps?.description} />
                    <input type="button" value={"Explore " + planetProps?.name} onClick={(e) => setLocation('/lbl-minigame')}/>
                </div>
            </div>
        </div>
    </>
}