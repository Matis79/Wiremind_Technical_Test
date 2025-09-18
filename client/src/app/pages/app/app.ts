import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaderboardComponent } from '@app/components/leaderboard.component/leaderboard.component';
import { SnapshotTableComponent } from '@app/components/snapshot-table/snapshot-table.component';
import { TimerComponent } from '@app/components/timer/timer.component';
import { VelocityKnobComponent } from '@app/components/velocity/velocity.component';
import { CounterService } from '@app/services/counter.service/counter.service';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule, VelocityKnobComponent, SnapshotTableComponent, LeaderboardComponent, TimerComponent],
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
})
export class AppComponent {
    title = 'Velocity Counter';
    counter = inject(CounterService);

    get velocity() {
        return this.counter.getVelocity();
    }
    set velocity(speed: number) {
        this.counter.setVelocity(speed);
    }
}
