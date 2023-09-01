import useSpaceLobby from '../stores/useSpaceLobby'

import DynamicMail from './DynamicMail'

import uiJson from '../assets/text/en/ui.json'

export default function GeneralInfoPanel( props )
{
    const togglePanel = useSpaceLobby((state => state.togglePanel ))

    const openTab = (event, order) => 
    {
        const tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++)
            tabcontent[i].style.display = "none";

        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById("panel"+order).style.display = "block";
        event.currentTarget.className += " active";
    }

    return (<>
            <div className='infotabs'>

                <button className="tablinks active" id="info-general" style={{width: "21%"}} onClick={(e) => openTab(e, 1)}>{uiJson["main"]["general"].label}</button>
                <button className="tablinks" id="3dpace-program" style={{width: "29%", overflow: "visible"}} onClick={(e) => openTab(e, 2)}>{uiJson["main"]["3dspace"].label}</button>
                <button className="tablinks" id="additional-info" style={{width: "20%"}} onClick={(e) => openTab(e, 3)}>{uiJson["main"]["contacts"].label}</button>
                <button className="tablinks" id="changelog" style={{width: "20%"}} onClick={(e) => openTab(e, 4)}>{uiJson["main"]["changelog"].label}</button>
                <button className="tablinks" id="close" style={{width: "10%"}} onClick={togglePanel}>&times;</button>
                <div id="infotabsinner">

                    <div id="panel1" className='tabcontent'>
                        <h2>{uiJson["main"]["general"].title}</h2>
                        <figure>
                            <img alt="Stefano Moscatelli's pixel portrait" src={uiJson["main"]["general"].image} />
                            <figcaption>(not an actual astronaut)</figcaption>
                        </figure>
                        {uiJson["main"]["general"].description.map((el, i) => <p key={i}>{el}</p>)}
                        {uiJson["main"]["general"].lists.map((list, i) => {
                            return <div key={i}>
                                <p key={"p"+ i}>{list.intro}</p>
                                <ul>
                                    {list.choices.map((choice, j) => {
                                        return <li key={j}>{choice}</li>
                                    })}
                                </ul>
                            </div>
                        })}
                    </div>

                    <div id="panel2" className='tabcontent'>
                        <h2>{uiJson["main"]["3dspace"].title}</h2>
                        <p>{uiJson["main"]["3dspace"].description}</p>
                        <div className="container">
                            <div className="container__progressbars">
                                {
                                    uiJson["main"]["3dspace"].elements.map((el, i) => {
                                    const newAmount = 440 - (el.amount * 440) / 100
                                    document.documentElement.style.setProperty("--amt-" + el.abbr, newAmount)
                                    return <div key={i} className="progressbar">
                                            <svg className="progressbar__svg">
                                                <circle cx="80" cy="80" r="70" className={"progressbar__svg-circle circle-" + el.abbr + " shadow-"+ el.abbr} />
                                            </svg>
                                            <span className={"progressbar__text shadow-"+ el.abbr}>{el.el}</span>
                                            <img alt={el.el+" icon"} src={uiJson["icons"][el.icon]} draggable="false" />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div id="panel3" className='tabcontent'>
                        <h2>{uiJson["main"]["contacts"].title}</h2>
                        <p>{uiJson["main"]["contacts"].description}</p>
                        <p>{uiJson["main"]["contacts"].oldcv} <a href="/plain_cv.html">here</a>.</p>
                        <a className="contact" href={uiJson["main"]["contacts"].github}>GitHub</a>
                        <a className="contact" href={uiJson["main"]["contacts"].linkedin}>LinkedIn</a>
                        <DynamicMail />
                    </div>

                    <div id="panel4" className='tabcontent'>
                        <h2>{uiJson["main"]["changelog"].title}</h2>
                        <p>{uiJson["main"]["changelog"].description}</p>
                        <ul>{uiJson["main"]["changelog"].changes.map((el, i) => <li key={i}>{el[i].date}: {el[i].change}</li>)}</ul>
                        <div>
                            <h3>{uiJson["main"]["credits"].label}</h3>
                            <p>{uiJson["main"]["credits"].description}</p>
                            <div>
                                {uiJson["main"]["credits"].items.map((el, i) => {
                                    return <div className="creditItem" key={"credits"+ i}>
                                        <p>{el.item}: <a href={el.link} target='_blank'>{el.creditor}</a></p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}