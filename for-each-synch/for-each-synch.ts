import { Injectable } from '@angular/core';

@Injectable()
export class ForEachSynchProvider {

  constructor() {
    console.log('Hello ForEachSynchProvider Provider');
  }  

  private forEachStart(start: number, array: Array<object>, body: any, callback: any): void {
    var context = this;
    var next = function() {
      start = start + 1;
      context.forEachStart(start, array, body, callback);
    }
    if (start < array.length) {
      body(start, array, next);
    } else {
      callback(array);
    }
  }

  private forEachStartEnd(start: number, end: number, array: Array<object>, body: any, callback: any): void {
    var context = this;
    var next = function() {
      start = start + 1;
      context.forEachStartEnd(start, end, array, body, callback);
    }
    if (start < end && start < array.length) {
      body(start, array, next);
    } else {
      callback(array);
    }
  }

  private forEachAll(array: Array<object>, body: any, callback: any): void {
    this.forEachStart(0, array, body, callback);
  }

  forEach(array: Array<object>, body: any, callback: any): void;
  forEach(start: number, end: number, array: Array<object>, body: any, callback: any): void;
  forEach(start: number, array: Array<object>, body: any, callback: any): void;

  forEach(p1: any, p2: any, p3: any, p4?: any, p5?: any): void {
    if (typeof p4 == 'undefined' && typeof p5 == 'undefined') { 
      this.forEachAll(p1, p2, p3);
    } else if (typeof p4 == 'function' && typeof p5 == 'undefined') {
      this.forEachStart(p1, p2, p3, p4);
    } else if (typeof p4 == 'function' && typeof p5 == 'function') {
      this.forEachStartEnd(p1, p2, p3, p4, p5);
    }
  }
  
  /*
  this.fes.forEach(0, [], (index, array, next) => {

    }, (array) => {
      
    });
  */

}
