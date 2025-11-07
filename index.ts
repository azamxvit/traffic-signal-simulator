type Signal = 'RED' | 'GREEN' | 'LEFT' | 'RIGHT';
type Direction = 'FORWARD' | 'LEFT' | 'RIGHT';

interface TrafficLightController {
    subscribe(callback: (currentSignal: Signal) => void): void;
}

export class Traffic {
    private currentSignal: Signal;
    private listeners: Array<() => void> = [];

    constructor(initialSignal: Signal, trafficLightController: TrafficLightController) {
        this.currentSignal = initialSignal;

        trafficLightController.subscribe((currentSignal: Signal) => {
            this.currentSignal = currentSignal;
            this.listeners.forEach(check => check());
        });
    }

    async go(direction: Direction): Promise<void> {
        const canGo = (): boolean => {
            if (this.currentSignal === 'RED') return false;
            if (this.currentSignal === 'GREEN' && direction === 'FORWARD') return true;
            if (this.currentSignal === 'LEFT' && direction === 'LEFT') return true;
            if (this.currentSignal === 'RIGHT' && direction === 'RIGHT') return true;
            return false;
        };

        if (canGo()) return;

        await new Promise<void>((resolve) => {
            const check = () => {
                if (canGo()) {
                    this.listeners = this.listeners.filter(l => l !== check);
                    resolve();
                }
            };
            this.listeners.push(check);
        });
    }
}
