import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CounterService } from '@app/services/counter.service/counter.service';

@Component({
    selector: 'app-velocity',
    standalone: true,
    templateUrl: './velocity.component.html',
    imports: [CommonModule, FormsModule],
    styleUrls: ['./velocity.component.scss'],
})
export class VelocityKnobComponent {
    @Input() value = 0;
    @Input({ required: true }) counter!: CounterService;
}
