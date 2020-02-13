import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamHomePage } from './team-home.page';

describe('TeamHomePage', () => {
  let component: TeamHomePage;
  let fixture: ComponentFixture<TeamHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
