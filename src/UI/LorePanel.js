import { useState } from 'react'

import uiJson from '../assets/text/en/ui.json'

export default function LorePanel({ description })
{
    const [visible, setVisibile] = useState(false)

    return <>
    <div id="loreinfo" onClick={() => setVisibile(!visible)}>{uiJson.side.lore}<img alt="lore toggle" src={uiJson["icons"].arrow} style={visible ? { rotate: "90deg" } : { rotate: "0deg"}} /></div>
        {visible && 
        <div>
            {description}
            
        </div>}
    </>
}