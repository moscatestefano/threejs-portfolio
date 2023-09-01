import { useState, useRef } from 'react'

import uiJson from '../assets/text/en/ui.json'

export default function DynamicMail() 
{
    const [hovered, setHovered] = useState(false)
    const [copied, setCopied] = useState(false)

    const divRef = useRef()

    const mail = 'stefano'.concat('.', 'moscatelli'.concat('.', '1'.concat("@gmail.com")))

    const copyToClipboard = () => 
    {
        try{
            navigator.clipboard.writeText(mail)
            setCopied(true)
            clearTimeout(setClipboardTimeout)
            setClipboardTimeout()
        } catch (e) {
            console.log("Origin of the website is not secure. " + e)
        }
    }

    const setClipboardTimeout = () => {
        setTimeout(() => {
            setCopied(false)
        }, [1000])
    }

    return <span className="contact idcopy" ref={divRef} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => copyToClipboard()}>
        {!copied && hovered && <p>{uiJson["main"]["contacts"].hoveredtext}</p>}
        {!copied && !hovered && <p>{uiJson["main"]["contacts"].hovertext}</p>}
        {copied && <p>{uiJson["main"]["contacts"].clicktext}</p>}
    </span>
}