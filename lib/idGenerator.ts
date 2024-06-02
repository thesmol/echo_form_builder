export function idGenerator(): string {
    return Math.floor(Math.random() * Date.now()).toString();
}