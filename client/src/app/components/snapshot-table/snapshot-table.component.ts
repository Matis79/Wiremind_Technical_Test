import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Snapshot } from '@app/interfaces/interface';

@Component({
    selector: 'app-snapshot-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './snapshot-table.component.html',
    styleUrls: ['./snapshot-table.component.scss'],
})
export class SnapshotTableComponent {
    @Input() snapshots: Snapshot[] = [];

    showCount = 7;

    get displayed(): Snapshot[] {
        const snaps = this.snapshots || [];
        const n = this.showCount > 0 ? this.showCount : snaps.length;
        return snaps.slice(-n).reverse();
    }
}
