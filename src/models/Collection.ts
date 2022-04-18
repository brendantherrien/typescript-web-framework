import axios from 'axios';
import { Eventing } from './Eventing';

export class Collection<T, K> {
    private events: Eventing = new Eventing();
    public models: T[] = [];

    public constructor(
        private readonly rootUrl: string,
        public readonly deserialize: (json: K) => T
    ) {}

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    public fetch(): void {
        axios.get(this.rootUrl).then((response) => {
            response.data.forEach((value: K) => {
                this.models.push(this.deserialize(value));
            });

            this.trigger('change');
        });
    }
}
