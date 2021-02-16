import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {click} from '../common/test-utils';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let courseService: any;
  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');
  beforeEach(async(() => {
    const CourseServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: CourseServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        courseService = TestBed.get(CoursesService);
      });
  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });

  it('should display only beginner courses', () => {
    courseService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(1, 'Unexpected number of tabs');
  });

  it('should display only advanced courses', () => {
    courseService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(1, 'Unexpected number of tabs');
  });


  it('should display both tabs', () => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    expect(tab.length).toBe(2, 'Unexpected number of tabs');
  });


  it('should display advanced courses when tab clicked', fakeAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css('.mat-tab-label'));
    click(tab[1]);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0);
    console.log("cardTitles[0].nativeElement.textContent",cardTitles[0].nativeElement.textContent);
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

});


