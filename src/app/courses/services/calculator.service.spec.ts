import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {log} from 'util';
import {TestBed} from '@angular/core/testing';
import {providerDef} from '@angular/compiler/src/view_compiler/provider_compiler';

describe('CalculatorService', () => {

  let calculator: CalculatorService, loggerSpy: any;

  beforeEach(()  => {
    console.log("before Each");
    loggerSpy = jasmine.createSpyObj('LoggerService',["log"]);
    loggerSpy.log.and.returnValue(true);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: loggerSpy
        }
      ]
    });
    calculator = TestBed.get(CalculatorService);
  });

  it('should add two numbers', function () {
    const result = calculator.add(2,2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', function () {
    const result = calculator.subtract(2,2);
    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

})
