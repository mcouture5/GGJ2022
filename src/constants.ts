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

export enum BodyPart {
    'head' = 'head',
    'hair' = 'hair',
    'eyebrows' = 'eyebrows',
    'eyes' = 'eyes',
    'nose' = 'nose',
    'mouth' = 'mouth'
}

export const BodyChoices = {
    [BodyPart.head]: ['base1', 'base2'],
    [BodyPart.hair]: ['hair1'],
    [BodyPart.eyebrows]: ['eyebrows1'],
    [BodyPart.eyes]: ['eyes1'],
    [BodyPart.nose]: ['nose1', 'nose2', 'nose3', 'nose4'],
    [BodyPart.mouth]: ['mouth1']
};
