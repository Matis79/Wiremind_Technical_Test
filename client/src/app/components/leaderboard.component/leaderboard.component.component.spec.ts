import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardComponentComponent } from './leaderboard.component';

describe('LeaderboardComponentComponent', () => {
    let component: LeaderboardComponentComponent;
    let fixture: ComponentFixture<LeaderboardComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LeaderboardComponentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LeaderboardComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
