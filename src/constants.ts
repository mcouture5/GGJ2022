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
        hat: 1,
        safety: 1,
        scary: 1,
        party: 2,
        hungry: 1,
        friendly: 1,
        fast: -2,
        slippery: 1,
        alone: -1
    },
    safety: {
        hat: 1,
        safety: 2,
        scary: 1,
        party: -1,
        hungry: 1,
        friendly: 1,
        fast: -3,
        slippery: -3,
        alone: -2
    },
    scary: {
        hat: 1,
        safety: 1,
        scary: -3,
        party: 1,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: 1,
        alone: -1
    },
    party: {
        hat: 2,
        safety: -1,
        scary: 1,
        party: 2,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: 1,
        alone: -3
    },
    hungry: {
        hat: 1,
        safety: 1,
        scary: 1,
        party: -2,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: 1,
        alone: -1
    },
    friendly: {
        hat: 1,
        safety: 1,
        scary: -3,
        party: 2,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: 1,
        alone: -2
    },
    fast: {
        hat: -2,
        safety: -2,
        scary: 2,
        party: 1,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: -2,
        alone: 0
    },
    slippery: {
        hat: 1,
        safety: 2,
        scary: 1,
        party: 1,
        hungry: 1,
        friendly: 1,
        fast: 1,
        slippery: -2,
        alone: -1
    },
};