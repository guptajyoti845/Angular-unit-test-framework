import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

describe('CoursesServices', () => {
  let courseService: CoursesService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });
    courseService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should retrieve all courses', function () {
    courseService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No Course returned');
      expect(courses.length).toBe(12, 'Incorrect number of courses');
      const course = courses.find(course => course.id == 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('GET');

    req.flush({payload: Object.values(COURSES)});
  });

  it('should find a course by Id', function () {
    courseService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy('No Course returned');
      expect(course.id).toBe(12, 'Incorrect Course Id');
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toBe('GET');
    req.flush(COURSES[12]);
  });

  it('should save a course data', function () {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    courseService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12, 'Incorrect Course Id');
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[12]
    });
  });

  it('should give error when save rquest fails', function () {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    courseService.saveCourse(12, changes).subscribe(() =>
        fail('the save operation should have failed')
      , (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toBe('PUT');
    req.flush('Save request Failed', {status: 500, statusText: 'Internal Server Error'});

  });

  it('should find a list of lessons', function () {
    courseService.findLessons(12).subscribe(
      lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });
    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');
    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
