import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Snapshot } from '@app/interfaces/interface';

@Component({
    selector: 'app-leaderboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
    @Input() snapshots: Snapshot[] = [];
    @Input() goal = 0;

    get leaderBoard() {
        const goal = this.goal;
        return (this.snapshots || [])
            .map((snapshot) => ({ date: snapshot.date, counter: snapshot.counter, diff: Math.abs(snapshot.counter - goal) }))
            .sort((a, b) => a.diff - b.diff)
            .slice(0, 5);
    }
}
