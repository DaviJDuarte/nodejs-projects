import config from "config";

export default function (): void {
    if (!config.get('jwtPrivateKey')) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
    }
}

