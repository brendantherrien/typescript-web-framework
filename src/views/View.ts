import { Model } from './../models/Model';

export abstract class View<T extends Model<K>, K> {
    regions: { [key: string]: Element } = {};

    constructor(protected readonly parent: Element, public model: T) {
        this.bindModel();
    }

    abstract template(): string;

    regionsMap(): { [key: string]: string } {
        return {};
    }

    eventsMap(): { [key: string]: () => void } {
        return {};
    }

    bindModel(): void {
        this.model.on('change', () => {
            this.render();
        });
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();
        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');

            fragment.querySelectorAll(selector).forEach((element) => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }

    mapRegions(fragment: DocumentFragment): void {
        const map = this.regionsMap();

        for (let key in map) {
            const selector = map[key];
            const element = fragment.querySelector(selector);
            if (element) {
                this.regions[key] = element;
            }
        }
    }

    onRender(): void {}

    render(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();

        this.mapRegions(templateElement.content);
        this.bindEvents(templateElement.content);

        this.onRender();

        this.parent.append(templateElement.content);
    }
}
