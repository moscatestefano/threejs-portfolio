import uiJson from '../assets/text/en/ui.json'

export default function PleaseRotate()
{
    return <div className="pleaserotate">
            <p>{uiJson["pleaserotate"].text}<br />
                <img src={uiJson["pleaserotate"].imgUrl} alt='rotate your device' />
            </p>
        </div>
}