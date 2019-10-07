
## ionic foreach with callback  

This provider was created as a solution to JavaScript for loop quirk where all iterations of loop are executer simultaneously and are asynchronous. Thanks to this, I encountered situations, where for loop was updating data, but callbacks/promises were resolving before all of the data finished processing. This provider uses recursion to create for loop and each iteration is executed only after the previous one finished. Also, there is an option to use callback after final loop iteration.
  

**Table of Contents**

- [Installation](#installation)

- [Usage](#usage)

	-[ForEach](#foreach)
	
	-[ForFrom](#forfrom)
	
	-[ForFromTo](#forfromto)
  

## Installation

Install this provider by cloning this repository into your project 'providers' folder and by adding it to app.module.ts.
  

1. Navigate to 'providers' folder inside your project folder:

```
cd src/providers/
``` 

2. Clone this repository:

```
git clone https://github.com/xmudronc/ionic_foreach_with_callback.git
```  

3. Add provider to 'app.module.ts':

```typescript
import { ForEachSynchProvider } from '../providers/for-each-synch/for-each-synch';
  
@NgModule({
	providers: [
		...
		ForEachSynchProvider,
		...
	]
``` 

## Usage

Import provider to your page, add it to constructor and use the built in methods.
  
```typescript
import { ForEachSynchProvider } from '../../providers/for-each-synch/for-each-synch';  

constructor(
	public fes: ForEachSynchProvider
) {}
```  
```typescript
var data = [0, 1, 2, 3, 4]
this.fes.forEach(data, (index, array, next) => {
	console.log(array[index]);
	array[index]++;
	next();
}, (array) => {
	console.log(array);
});
```  
Console output is:

0

1

2

3

4

[1, 2, 3, 4, 5]  

The 'next()' function is required as a last function in the loop body and starts the next iteration.  

### ForEach

Iterate through the whole array.

```typescript
this.fes.forEach(array, body, callback);
```
```typescript
var data = [0, 1, 2, 3, 4]
this.fes.forEach(data, (index, array, next) => {
	console.log(array[index]);
	array[index]++;
	next();
}, (array) => {
	console.log(array);
});
```
Console output is:

0

1

2

3

4

[1, 2, 3, 4, 5]  

### ForFrom

Iterate through the array starting with 'start' and ending with the last element.

```typescript
this.fes.forEach(start, array, body, callback);
```
```typescript
var data = [0, 1, 2, 3, 4]
this.fes.forEach(1, data, (index, array, next) => {
	console.log(array[ndexs]);
	array[index]++;
	next();
}, (array) => {
	console.log(array);
});
```
Console output is:

1

2

3

4

[0, 2, 3, 4, 5]  

### ForFromTo

Iterate through the array starting with 'start' and ending with 'end'.

```typescript
this.fes.forEach(start, end, array, body, callback);
```
```typescript
var data = [0, 1, 2, 3, 4]
this.fes.forEach(1, 3, data, (index, array, next) => {
	console.log(array[ndexs]);
	array[index]++;
	next();
}, (array) => {
	console.log(array);
});
```
Console output is:

1

2

[0, 2, 3, 3, 4]
