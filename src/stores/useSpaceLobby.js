import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => 
{

    return {
        // MAIN PANEL
        isPanelOpen: false,
        togglePanel: () => set(state => ({ isPanelOpen: !state.isPanelOpen })),
        // PLANET
        planetInspected: false, 
        planetObjectRef: undefined,
        currentPlanetProps: undefined, // object filled with all the text of a planet
        // SWITCH SYSTEM
        isSwitchToggled: false,
        toggleSwitch: () => set(state => ({isSwitchToggled: !state.isSwitchToggled})),
        isJumping: false
    }
}))