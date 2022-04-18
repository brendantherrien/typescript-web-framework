export type Callback = () => void;

export class Eventing {
    private readonly events: { [key: string]: Callback[] } = {};

    constructor() {}

    public on = (eventName: string, callback: Callback): void => {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    };

    public trigger = (eventName: string): void => {
        const handlers = this.events[eventName];

        if (!handlers?.length) {
            return;
        }

        handlers.forEach((callback) => callback());
    };
}
