![Current Version](https://img.shields.io/npm/v/hold-on.svg)
![NPM Minified size](https://img.shields.io/bundlephobia/min/hold-on.svg)
![Github Code Size](https://img.shields.io/github/languages/code-size/wjsc/hold-on.svg)
![Downloads/Year](https://img.shields.io/npm/dy/hold-on.svg)
![Issues](https://img.shields.io/github/issues/wjsc/hold-on.svg)
![License](https://img.shields.io/github/license/wjsc/hold-on.svg)
![Contributors](https://img.shields.io/github/contributors/wjsc/hold-on.svg)

[![NPM](https://nodei.co/npm/hold-on.png)](https://nodei.co/npm/hold-on)

# Hold-on

## Use case

This package can be used in this scenario

1. You have a costly function: time consuming, heavy CPU or IO usage
2. You need to perform that function frequently
3. The result of your function can change over time
4. You can tolerate some -configurable- inconsistency
5. You want to optimize that process

## How it works

It stores in memory the result of your function for immediate access, and clears that memory after a specified time.
It returns a function that can be used instead your original one.

```
const hold = require('hold-on');
const myCachedFunction = hold(<Your Function>, <Time in miliseconds>);
myCachedFunction();
```

## Usage

#### 1. First example

```
const hold = require('hold-on');

// Define your costly function: Let's supose it's so heavy!
const myFunction = () => new Date(); 

// Make a cached version of your function with 500 ms cache
const myCachedFunction = hold(myFunction, 500);

// This code will execute new Date() only once
for(let i = 0; i<50; i++){
    // And it prints always the same date
    console.log(myCachedFunction());
}
```

#### 2. Second example: Retrieving a remote resource

```
const hold = require('hold-on');
const fetch = require('node-fetch); // Or any HTTP client

const myFunction = () => fetch('https://httpstat.us/200');
const myCachedFunction = hold(myFunction, 5000);

// This code will execute the HTTP GET only once
for(let i = 0; i<50; i++){
    console.log(myCachedFunction());
}
// After 500 ms the request will be executed again

```

#### 3. Third example: It's also great to retrieve a file from a remote Storage such as S3

```
const hold = require('hold-on');
const aws = require('aws-sdk');
const s3 = new aws.S3();

const myFunction = s3.getObject({ Bucket: 'abc', Key: 'abc.txt' });
const myCachedFunction = hold(myFunction, 20000);

```


## 100% Tested Library

Every line of code is tested
https://github.com/wjsc/hold-on/blob/master/test/index.test.js

## Tiny size

Less than 20 lines of code and no dependencies


## Advanced 
#### How to force termination

This function uses setTimeout to clear the internal cache. In some cases, you may need to clear this timer.
This can be usefull if you are running a script that doesn't end at desired time, or if you want to terminate a background timer.

```
const myFunction = () => {};
const myCachedFunction = hold(myFunction, 100000000);
clearInterval(myCachedFunction.interval);
```

#### How to clear the memory cache

Just use the original function!


Package name reference: https://www.youtube.com/watch?v=WPnOEiehONQ