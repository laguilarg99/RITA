import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDialogComponent } from './metrics-dialog.component';

describe('MetricsDialogComponent', () => {
  let component: MetricsDialogComponent;
  let fixture: ComponentFixture<MetricsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
