import {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
};

export default config;