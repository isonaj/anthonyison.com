---
title: Angular Ivy - The Next Generation View Engine
image:
tags:
- angular
---
Each release of Angular brings something new, but not something that rocks my world. With Angular 8, we got a new experimental view engine called Ivy, which will become the default view engine in Angular 9. In this post, I will discuss what Ivy is, why you should be care about Ivy and how to use it.

> Before I get started, I should point out that it is **EXPERIMENTAL** and **INCOMPLETE**. You can see the current state of Ivy [here](https://is-angular-ivy-ready.firebaseapp.com/#/status).

## What is Ivy?
Ivy is the 3rd generation Angular templating engine. The first templating engine was released with Angular 2 and the next was released with Angular 4 (after skipping version 3). Ivy basically lives between your HTML template and your code.

The first generation was pretty bare-bones, converting the HTML straight to javascript DOM manipulation. It worked, but the bundles were HUGE!

The second generation (in use today), produced much less template code but had an issue with the complexity of the code, making it difficult to debug. Why would you debug the template code? Well, this is mostly visible in the callstack of the error messages you receive from template issues (such as misspelling a method name).

Ivy is the third generation and addresses the issues with the previous view engines. More than that, the framework has been broken up in a way that allows tree-shaking techniques to only include the code that is actually needed by your application, which is why it can deliver some pretty amazing benefits.

## Why you should care about Ivy
You really should care about Ivy because it will deliver:
* Smaller bundles
* Faster compilation
* Smaller memory footprint
* Easier to debug
* Dynamic loading of modules and components
* Backwards compatible

The Angular team are focused on maintaining backwards compatibility with Ivy, so you will gain access to all of these benefits with minimal impact to your production code. The main benefits you will see is a **significantly reduced** package size, mostly in the templating code with an expected impact on the runtime with Angular 9. How much smaller, you ask?  Let's take a look!

Building without Ivy:
```
chunk {0} runtime-es2015.24b02acc1f369d9b9f37.js (runtime) 2.83 kB [entry] [rendered]
chunk {1} main-es2015.c92ce36e49a890a8b631.js (main) 369 kB [initial] [rendered]
chunk {2} polyfills-es2015.fd917e7c3ed57f282ee5.js (polyfills) 64.3 kB [initial] [rendered]
chunk {3} polyfills-es5-es2015.f9fad3ad3c84e6dbdd72.js (polyfills-es5) 211 kB [initial] [rendered]
chunk {4} styles.09e2c710755c8867a460.css (styles) 0 bytes [initial] [rendered]
Date: 2019-08-25T22:45:27.477Z - Hash: d8adfeb9997df0ac32cc - Time: 41195ms
Generating ES5 bundles for differential loading...
ES5 bundle generation complete.
```

Building with Ivy:
```
chunk {0} runtime-es2015.24b02acc1f369d9b9f37.js (runtime) 2.83 kB [entry] [rendered]
chunk {1} main-es2015.b387fededa5ab7a11f63.js (main) 374 kB [initial] [rendered]
chunk {2} polyfills-es2015.fd917e7c3ed57f282ee5.js (polyfills) 64.3 kB [initial] [rendered]
chunk {3} polyfills-es5-es2015.f9fad3ad3c84e6dbdd72.js (polyfills-es5) 211 kB [initial] [rendered]
chunk {4} styles.09e2c710755c8867a460.css (styles) 0 bytes [initial] [rendered]
Date: 2019-08-25T23:47:57.628Z - Hash: 3056f3da07af1e491edd - Time: 23688ms
Generating ES5 bundles for differential loading...
ES5 bundle generation complete.
```

Today, Angular uses a Virtual DOM which means that for each change, the framework builds up a representation of the view, and the runtime determines the changes and applies to the DOM. Ivy doesn't use a Virtual DOM. It uses an Incremental DOM. So with Ivy, the template IS the runtime. There's no double handling, the changes translate directly onto the DOM. This is how Ivy delivers a smaller memory footprint (and hopefully faster rendering).

There is a lot more to cover about Ivy, including HOC (higher order components) and change detection. If you want to go down the rabbit hole, I recommend the following reading:
* [Angular In Depth: All you need to know about Ivy](https://blog.angularindepth.com/all-you-need-to-know-about-ivy-the-new-angular-engine-9cde471f42cf) 
* [Nrwl: Understanding Angular Ivy](https://blog.nrwl.io/understanding-angular-ivy-incremental-dom-and-virtual-dom-243be844bf36)
* [Telerik: First Look at Angular Ivy](https://www.telerik.com/blogs/first-look-angular-ivy)
* [Ninja Squad: What is Angular Ivy](https://blog.ninja-squad.com/2019/05/07/what-is-angular-ivy/)

## How to use Ivy
> If you want to try out Ivy, [it is recommended](https://angular.io/guide/ivy) to install `@angular/core@next`, rather than `@angular/core@latest` so that you get all the latest bug fixes and improvements.

To get started with Ivy, you can create a new application with the `--enableIvy` command line option:
```bash
$ ng new my-app --enable-ivy
```

To enable Ivy in an *existing* application, update your `tsconfig.app.json` file with the following:
```js
{
  "compilerOptions": { ... },
  "angularCompilerOptions": {
    "enableIvy": true
  }
}
```
Building with Ivy is faster with AOT compilation, so also make sure you have that enabled in the `angular.json` file or by specifying `-aot` on the command line.


As you can see, Angular 9 is going to really change things up when Ivy becomes the default view engine. It is worth looking at Ivy now to see 