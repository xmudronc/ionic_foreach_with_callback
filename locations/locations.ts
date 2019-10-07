import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { File } from '@ionic-native/file';
import { ForEachSynchProvider } from '../../providers/for-each-synch/for-each-synch';

@Injectable()

export class LocationsProvider {
  counter: any;
  outLoc: any = [];

  constructor(
    private file: File,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    public fes: ForEachSynchProvider) {
    console.log('Hello LocationsProvider Provider');
  }

  loadDistances(lat, lon) {
    return new Promise((resolve, reject) => {
      this.http.get(MyApp.mainUrl + '/api/Distances?position=' + lat + ',' + lon + '&app=dc&state=foreground&token=firebase_token')
        .subscribe((distances: any) => {
          var distanceData = JSON.parse(distances);
          resolve(distanceData);
        }, err => {
          reject(new Error('reject ' + err));
        });
    });
  }

  async writeToFile(file, data, timestamp) {
    this.file.writeFile(this.file.dataDirectory, file, data, { replace: true }).then(() => {
      console.log('file write ok: ' + file);
      if (timestamp) {
        var time = '' + new Date();
        MyApp.nativeStor.setItem('data-timestamp', time, function () {
          console.log('Stored item: data-timestamp with value: ' + time);
        }, function (error) {
          console.error('Error storing item: data-timestamp', error);
        });
      }
    }).catch(err => {
      console.log('file write err: ' + err.code);
    });
  }

  load(backend) {
    if (backend) {
      return new Promise((resolve, reject) => {
        this.loadFromBackend().then((data) => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.loadFromMemory().then((data) => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    }
  }

  processData(location, data) {
    return new Promise((resolve) => {
      location.notification = null;
      location.distance = null;
      location.distanceToNearest = null;
      location.imgs = [];
      location.visited = false;
      location.imgStyle = undefined
      location.img = undefined;
      location.paragraphs = [];
      /*data.json.forEach(element => {
        if (element.data_type == "data:image/jpeg" || element.data_type == "data:image/png" || element.data_type == "data:image/jpg") {
          location.imgStyle = element.data_type + ";" + element.data;
          location.img = this.sanitizer.bypassSecurityTrustResourceUrl(element.data_type + ";" + element.data);
          location.imgs.push(this.sanitizer.bypassSecurityTrustResourceUrl(element.data_type + ";" + element.data));
        } else if (element.data_type == "paragrafs") {
          location.paragraphs = JSON.parse(element.data);
        }
      });
      resolve(location);*/
      this.fes.forEach(data.json, (index, array, next) => {
        if (array[index].data_type == "data:image/jpeg" || array[index].data_type == "data:image/png" || array[index].data_type == "data:image/jpg") {
          location.imgStyle = array[index].data_type + ";" + array[index].data;
          location.img = this.sanitizer.bypassSecurityTrustResourceUrl(array[index].data_type + ";" + array[index].data);
          location.imgs.push(this.sanitizer.bypassSecurityTrustResourceUrl(array[index].data_type + ";" + array[index].data));
        } else if (array[index].data_type == "paragrafs") {
          location.paragraphs = JSON.parse(array[index].data);
        }
        next();
      }, (array) => {
        resolve(location);
      });
    });
  }

  loadDataFromMemory(location) {
    return new Promise((resolve, reject) => {
      this.file.checkFile(this.file.dataDirectory, location.id + '.json')
        .then(() => {
          console.log('file exists ' + location.id + '.json');
          this.file.readAsText(this.file.dataDirectory, location.id + '.json').then((json) => {
            var data = { loc_id: location.id, json: JSON.parse(json) };
            resolve(data);
          }).catch(err => {
            console.log('file read err: ' + err);
            reject(err);
          });
        }).catch(err => {
          console.log('file exists err: ' + err);
          reject(err);
        });
    });
  }

  loadDataFromBackend(location) {
    return new Promise((resolve, reject) => {
      this.http.get(MyApp.mainUrl + '/api/Data?app=dc&location=' + location.id)
        .subscribe((json: any) => {
          this.writeToFile(location.id + '.json', JSON.stringify(json), false);
          var data = { loc_id: location.id, json: JSON.parse(JSON.stringify(json)) };
          resolve(data);
        }, err => {
          console.log('file load err: ' + err);
          reject(err);
        });
    });
  }

  loadFromMemory() {
    return new Promise((resolve, reject) => {
      this.file.checkFile(this.file.dataDirectory, 'data.json')
        .then(() => {
          console.log('file exists data.json');
          this.file.readAsText(this.file.dataDirectory, 'data.json').then((json) => {
            //console.log(json);
            var data = JSON.parse(json);
            /*data.forEach(location => {
              this.loadDataFromMemory(location).then((data) => {
                this.processData(location, data).then((data) => {
                  location = data;
                });
              });
            });
            resolve(data);*/
            this.fes.forEach(data, (index, array, next) => {
              this.loadDataFromMemory(array[index]).then((data) => {
                this.processData(array[index], data).then((data) => {
                  array[index] = data;
                  next();
                });
              });
            }, (array) => {
              resolve(array);
            });
          }).catch(err => {
            console.log('file read err: ' + err);
            reject(err);
          });
        }).catch(err => {
          console.log('file exists err: ' + err);
          reject(err);
        });
    });
  }

  loadFromBackend() {
    return new Promise((resolve, reject) => {
      this.http.get(MyApp.mainUrl + '/api/Locations?app=dc&state=foreground')
        .subscribe((json: any) => {
          this.writeToFile('data.json', JSON.stringify(json), true);
          //console.log(json);
          var data = JSON.parse(JSON.stringify(json));
          /*data.forEach(location => {
            this.loadDataFromBackend(location).then((data) => {
              this.processData(location, data).then((data) => {
                location = data;
              });
            });
          });
          resolve(data);*/
          this.fes.forEach(data, (index, array, next) => {
            this.loadDataFromBackend(array[index]).then((data) => {
              this.processData(array[index], data).then((data) => {
                array[index] = data;
                next();
              });
            });
          }, (array) => {
            resolve(array);
          });
        }, err => {
          console.log('file load err: ' + err);
          reject(err);
        });
    });
  }

}
