import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CounterService } from '@app/services/counter.service/counter.service';
import { SnapshotTableComponent } from '../snapshot-table/snapshot-table.component';

@Component({
    selector: 'app-timer',
    standalone: true,
    imports: [CommonModule, SnapshotTableComponent],
    templateUrl: './timer.component.html',
    styleUrl: './timer.component.scss',
})
export class TimerComponent {
    @Input({ required: true }) counter!: CounterService;

    isPlaying = false;

    toggle() {
        if (this.counter.isCounterZero()) {
            this.isPlaying = false;
        }
        this.isPlaying = !this.isPlaying;
        this.counter.setVelocity(this.isPlaying ? 1 : 0);
    }
}
