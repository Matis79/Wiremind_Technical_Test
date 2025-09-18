import { Injectable, signal } from '@angular/core';
import { Snapshot } from '@app/interfaces/interface';

@Injectable({ providedIn: 'root' })
export class CounterService {
    private _counter = signal(0);
    private _velocity = signal(0);
    private _snapshots = signal<Snapshot[]>([]);

    constructor() {
        let previousTime = performance.now();

        const animationLoop = (currentTime: number) => {
            const deltaSeconds = (currentTime - previousTime) / 1000;
            previousTime = currentTime;

            this._counter.update((currentValue) => currentValue + this._velocity() * deltaSeconds);
            requestAnimationFrame(animationLoop);
        };
        requestAnimationFrame(animationLoop);
    }

    private _goal = parseFloat((Math.random() * 100).toFixed(2));
    getGoal(): number {
        return this._goal;
    }

    getCounterValue(): string {
        return this._counter().toFixed(2);
    }
    getVelocity(): number {
        return this._velocity();
    }
    setVelocity(speed: number) {
        this._velocity.set(speed);
    }
    incVelocity(d: number) {
        this._velocity.update((v) => v + d);
    }

    resetCounter() {
        this._counter.set(0);
        this._snapshots.set([]);
        this._goal = parseFloat((Math.random() * 100).toFixed(2));
    }

    takeSnapshot() {
        this._snapshots.update((currentSnapshots) => [
            ...currentSnapshots,
            { date: new Date(), counter: this._counter(), velocity: this._velocity() },
        ]);
    }
    getSnapshots(): Snapshot[] {
        return this._snapshots();
    }
}
export { Snapshot };
