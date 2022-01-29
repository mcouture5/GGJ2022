export const DISPLAY_SIZE = {
    width: 1920,
    height: 1080
};

export const BACKGROUND_COLOR = '#e4e4eb';
export const BACKGROUND_HEX_COLOR = 0xe4e4eb;
export const BACKGROUND_RBG = {
    r: 228,
    g: 228,
    b: 235
};

export const TYPES = [
    'hat',
    'safety',
    'scary',
    'party',
    'hungry',
    'friendly',
    'fast',
    'slippery'
];

// INTERACTIONS[type1][type2] = X
// type1 will change happiness for being next to type2 by X amount (0 means they are ok with it, negative means they get angry)
// always lookup INTERACTIONS[type2][type1] as well to update both characters' happiness
// INTERACTIONS[type]['alone'] determines happiness change from being placed alone
export const INTERACTIONS = {
    hat: {
        hat: 0,
        safety: 0,
        scary: 0,
        party: 0, // +1
        hungry: 0,
        friendly: 0,
        fast: -1,
        slippery: 0,
        alone: -1
    },
    safety: {
        hat: 0,
        safety: 0, // +1
        scary: 0,
        party: 0,
        hungry: 0,
        friendly: 0,
        fast: -2,
        slippery: -2,
        alone: -2
    },
    scary: {
        hat: 0,
        safety: 0,
        scary: -2,
        party: 0,
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: 0,
        alone: -1
    },
    party: {
        hat: 0, // +1
        safety: 0,
        scary: 0,
        party: -1,
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: 0,
        alone: -2
    },
    hungry: {
        hat: 0,
        safety: 0,
        scary: 0,
        party: -1,
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: 0,
        alone: -1
    },
    friendly: {
        hat: 0,
        safety: 0,
        scary: -2,
        party: 0, // +1
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: 0,
        alone: -2
    },
    fast: {
        hat: -1,
        safety: -1,
        scary: 0, // +1
        party: 0,
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: -1,
        alone: 0
    },
    slippery: {
        hat: 0,
        safety: 0, // +1
        scary: 0,
        party: 0,
        hungry: 0,
        friendly: 0,
        fast: 0,
        slippery: -1,
        alone: -1
    },
};