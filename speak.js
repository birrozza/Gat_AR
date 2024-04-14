(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Speaker = {}));
    }(this, (function (exports) {
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
    
        return arr2;
      }
    }
    
    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }
    
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
    
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
    
    var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : self,
        _registry = _global["__commonjs__registry__"] = _global["__commonjs__registry__"] || {};
    
    _registry["1"] = _registry["1"] || {};
    var _module = {
      get exports() {
        return _registry["1"];
      },
    
      set exports(_) {
        _registry["1"] = _;
      }
    
    };
    
    (function (module, exports) {
      /**
       * Copyright (c) 2014-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var runtime = function (exports) {
    
        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var undefined$1; // More compressible than void 0.
    
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    
        function wrap(innerFn, outerFn, self, tryLocsList) {
          // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
          var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
          // .throw, and .return methods.
    
          generator._invoke = makeInvokeMethod(innerFn, self, context);
          return generator;
        }
    
        exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
        // record like context.tryEntries[i].completion. This interface could
        // have been (and was previously) designed to take a closure to be
        // invoked without arguments, but in all the cases we care about we
        // already have an existing method we want to call, so there's no need
        // to create a new function object. We can even get away with assuming
        // the method takes exactly one argument, since that happens to be true
        // in every case, so we don't have to touch the arguments object. The
        // only additional allocation required is the completion record, which
        // has a stable shape and so hopefully should be cheap to allocate.
    
        function tryCatch(fn, obj, arg) {
          try {
            return {
              type: "normal",
              arg: fn.call(obj, arg)
            };
          } catch (err) {
            return {
              type: "throw",
              arg: err
            };
          }
        }
    
        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
        // breaking out of the dispatch switch statement.
    
        var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
        // .constructor.prototype properties for functions that return Generator
        // objects. For full spec compliance, you may wish to configure your
        // minifier not to mangle the names of these two functions.
    
        function Generator() {}
    
        function GeneratorFunction() {}
    
        function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
        // don't natively support it.
    
    
        var IteratorPrototype = {};
    
        IteratorPrototype[iteratorSymbol] = function () {
          return this;
        };
    
        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    
        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
          // This environment has a native %IteratorPrototype%; use it instead
          // of the polyfill.
          IteratorPrototype = NativeIteratorPrototype;
        }
    
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
        GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
        GeneratorFunctionPrototype.constructor = GeneratorFunction;
        GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
        // Iterator interface in terms of a single ._invoke method.
    
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function (method) {
            prototype[method] = function (arg) {
              return this._invoke(method, arg);
            };
          });
        }
    
        exports.isGeneratorFunction = function (genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;
          return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };
    
        exports.mark = function (genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
    
            if (!(toStringTagSymbol in genFun)) {
              genFun[toStringTagSymbol] = "GeneratorFunction";
            }
          }
    
          genFun.prototype = Object.create(Gp);
          return genFun;
        }; // Within the body of any async function, `await x` is transformed to
        // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
        // `hasOwn.call(value, "__await")` to determine if the yielded value is
        // meant to be awaited.
    
    
        exports.awrap = function (arg) {
          return {
            __await: arg
          };
        };
    
        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
    
            if (record.type === "throw") {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
    
              if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
                return PromiseImpl.resolve(value.__await).then(function (value) {
                  invoke("next", value, resolve, reject);
                }, function (err) {
                  invoke("throw", err, resolve, reject);
                });
              }
    
              return PromiseImpl.resolve(value).then(function (unwrapped) {
                // When a yielded Promise is resolved, its final value becomes
                // the .value of the Promise<{value,done}> result for the
                // current iteration.
                result.value = unwrapped;
                resolve(result);
              }, function (error) {
                // If a rejected Promise was yielded, throw the rejection back
                // into the async generator function so it can be handled there.
                return invoke("throw", error, resolve, reject);
              });
            }
          }
    
          var previousPromise;
    
          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl(function (resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }
    
            return previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
          } // Define the unified helper method that is used to implement .next,
          // .throw, and .return (see defineIteratorMethods).
    
    
          this._invoke = enqueue;
        }
    
        defineIteratorMethods(AsyncIterator.prototype);
    
        AsyncIterator.prototype[asyncIteratorSymbol] = function () {
          return this;
        };
    
        exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
        // AsyncIterator objects; they just return a Promise for the value of
        // the final result produced by the iterator.
    
        exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0) PromiseImpl = Promise;
          var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
          return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
        };
    
        function makeInvokeMethod(innerFn, self, context) {
          var state = GenStateSuspendedStart;
          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }
    
            if (state === GenStateCompleted) {
              if (method === "throw") {
                throw arg;
              } // Be forgiving, per 25.3.3.3.3 of the spec:
              // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
    
    
              return doneResult();
            }
    
            context.method = method;
            context.arg = arg;
    
            while (true) {
              var delegate = context.delegate;
    
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
    
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }
    
              if (context.method === "next") {
                // Setting context._sent for legacy support of Babel's
                // function.sent implementation.
                context.sent = context._sent = context.arg;
              } else if (context.method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }
    
                context.dispatchException(context.arg);
              } else if (context.method === "return") {
                context.abrupt("return", context.arg);
              }
    
              state = GenStateExecuting;
              var record = tryCatch(innerFn, self, context);
    
              if (record.type === "normal") {
                // If an exception is thrown from innerFn, we leave state ===
                // GenStateExecuting and loop back for another invocation.
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;
    
                if (record.arg === ContinueSentinel) {
                  continue;
                }
    
                return {
                  value: record.arg,
                  done: context.done
                };
              } else if (record.type === "throw") {
                state = GenStateCompleted; // Dispatch the exception by looping back around to the
                // context.dispatchException(context.arg) call above.
    
                context.method = "throw";
                context.arg = record.arg;
              }
            }
          };
        } // Call delegate.iterator[context.method](context.arg) and handle the
        // result, either by returning a { value, done } result from the
        // delegate iterator, or by modifying context.method and context.arg,
        // setting context.delegate to null, and returning the ContinueSentinel.
    
    
        function maybeInvokeDelegate(delegate, context) {
          var method = delegate.iterator[context.method];
    
          if (method === undefined$1) {
            // A .throw or .return when the delegate iterator has no .throw
            // method always terminates the yield* loop.
            context.delegate = null;
    
            if (context.method === "throw") {
              // Note: ["return"] must be used for ES3 parsing compatibility.
              if (delegate.iterator["return"]) {
                // If the delegate iterator has a return method, give it a
                // chance to clean up.
                context.method = "return";
                context.arg = undefined$1;
                maybeInvokeDelegate(delegate, context);
    
                if (context.method === "throw") {
                  // If maybeInvokeDelegate(context) changed context.method from
                  // "return" to "throw", let that override the TypeError below.
                  return ContinueSentinel;
                }
              }
    
              context.method = "throw";
              context.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
    
            return ContinueSentinel;
          }
    
          var record = tryCatch(method, delegate.iterator, context.arg);
    
          if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }
    
          var info = record.arg;
    
          if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
          }
    
          if (info.done) {
            // Assign the result of the finished delegate to the temporary
            // variable specified by delegate.resultName (see delegateYield).
            context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).
    
            context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
            // exception, let the outer generator proceed normally. If
            // context.method was "next", forget context.arg since it has been
            // "consumed" by the delegate iterator. If context.method was
            // "return", allow the original .return call to continue in the
            // outer generator.
    
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined$1;
            }
          } else {
            // Re-yield the result returned by the delegate method.
            return info;
          } // The delegate iterator is finished, so forget it and continue with
          // the outer generator.
    
    
          context.delegate = null;
          return ContinueSentinel;
        } // Define Generator.prototype.{next,throw,return} in terms of the
        // unified ._invoke helper method.
    
    
        defineIteratorMethods(Gp);
        Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
        // @@iterator function is called on it. Some browsers' implementations of the
        // iterator prototype chain incorrectly implement this, causing the Generator
        // object to not be returned from this call. This ensures that doesn't happen.
        // See https://github.com/facebook/regenerator/issues/274 for more details.
    
        Gp[iteratorSymbol] = function () {
          return this;
        };
    
        Gp.toString = function () {
          return "[object Generator]";
        };
    
        function pushTryEntry(locs) {
          var entry = {
            tryLoc: locs[0]
          };
    
          if (1 in locs) {
            entry.catchLoc = locs[1];
          }
    
          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }
    
          this.tryEntries.push(entry);
        }
    
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = "normal";
          delete record.arg;
          entry.completion = record;
        }
    
        function Context(tryLocsList) {
          // The root entry object (effectively a try statement without a catch
          // or a finally block) gives us a place to store values thrown from
          // locations where there is no enclosing try statement.
          this.tryEntries = [{
            tryLoc: "root"
          }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }
    
        exports.keys = function (object) {
          var keys = [];
    
          for (var key in object) {
            keys.push(key);
          }
    
          keys.reverse(); // Rather than returning an object with a next method, we keep
          // things simple and return the next function itself.
    
          return function next() {
            while (keys.length) {
              var key = keys.pop();
    
              if (key in object) {
                next.value = key;
                next.done = false;
                return next;
              }
            } // To avoid creating an additional object, we just hang the .value
            // and .done properties off the next function object itself. This
            // also ensures that the minifier will not anonymize the function.
    
    
            next.done = true;
            return next;
          };
        };
    
        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
    
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }
    
            if (typeof iterable.next === "function") {
              return iterable;
            }
    
            if (!isNaN(iterable.length)) {
              var i = -1,
                  next = function next() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next.value = iterable[i];
                    next.done = false;
                    return next;
                  }
                }
    
                next.value = undefined$1;
                next.done = true;
                return next;
              };
    
              return next.next = next;
            }
          } // Return an iterator with no values.
    
    
          return {
            next: doneResult
          };
        }
    
        exports.values = values;
    
        function doneResult() {
          return {
            value: undefined$1,
            done: true
          };
        }
    
        Context.prototype = {
          constructor: Context,
          reset: function reset(skipTempReset) {
            this.prev = 0;
            this.next = 0; // Resetting context._sent for legacy support of Babel's
            // function.sent implementation.
    
            this.sent = this._sent = undefined$1;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = undefined$1;
            this.tryEntries.forEach(resetTryEntry);
    
            if (!skipTempReset) {
              for (var name in this) {
                // Not sure about the optimal order of these conditions:
                if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                  this[name] = undefined$1;
                }
              }
            }
          },
          stop: function stop() {
            this.done = true;
            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
    
            if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }
    
            return this.rval;
          },
          dispatchException: function dispatchException(exception) {
            if (this.done) {
              throw exception;
            }
    
            var context = this;
    
            function handle(loc, caught) {
              record.type = "throw";
              record.arg = exception;
              context.next = loc;
    
              if (caught) {
                // If the dispatched exception was caught by a catch block,
                // then let that catch block handle the exception normally.
                context.method = "next";
                context.arg = undefined$1;
              }
    
              return !!caught;
            }
    
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;
    
              if (entry.tryLoc === "root") {
                // Exception thrown outside of any try block that could handle
                // it, so set the completion value of the entire function to
                // throw the exception.
                return handle("end");
              }
    
              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, "catchLoc");
                var hasFinally = hasOwn.call(entry, "finallyLoc");
    
                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          },
          abrupt: function abrupt(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
    
              if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                var finallyEntry = entry;
                break;
              }
            }
    
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
              // Ignore the finally entry if control is not jumping to a
              // location outside the try/catch block.
              finallyEntry = null;
            }
    
            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;
    
            if (finallyEntry) {
              this.method = "next";
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }
    
            return this.complete(record);
          },
          complete: function complete(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }
    
            if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = this.arg = record.arg;
              this.method = "return";
              this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }
    
            return ContinueSentinel;
          },
          finish: function finish(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
    
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },
          "catch": function _catch(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
    
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
    
                if (record.type === "throw") {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
    
                return thrown;
              }
            } // The context.catch method must only be called with a location
            // argument that corresponds to a known catch block.
    
    
            throw new Error("illegal catch attempt");
          },
          delegateYield: function delegateYield(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName: resultName,
              nextLoc: nextLoc
            };
    
            if (this.method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              this.arg = undefined$1;
            }
    
            return ContinueSentinel;
          }
        }; // Regardless of whether this script is executing as a CommonJS module
        // or not, return the runtime object so that we can declare the variable
        // regeneratorRuntime in the outer scope, which allows this module to be
        // injected easily by `bin/regenerator --include-runtime script.js`.
    
        return exports;
      }( // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      typeof module === "object" ? module.exports : {});
    
      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        // This module should not be running in strict mode, so the above
        // assignment should always work unless something is misconfigured. Just
        // in case runtime.js accidentally runs in strict mode, we can escape
        // strict mode using a global Function call. This could conceivably fail
        // if a Content Security Policy forbids using Function, but in that case
        // the proper solution is to fix the accidental strict mode problem. If
        // you've misconfigured your bundler to force strict mode and applied a
        // CSP to forbid Function, and you're not willing to fix either of those
        // problems, please detail your unique predicament in a GitHub issue.
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    })(_module, _module.exports);
    
    var runtime = _module.exports;
    
    var _regeneratorRuntime = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': runtime
    });
    
    var _global$1 = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : self,
        _registry$1 = _global$1["__commonjs__registry__"] = _global$1["__commonjs__registry__"] || {};
    
    _registry$1["0"] = _registry$1["0"] || {};
    
    var _regeneratorRuntime2 = "default" in _regeneratorRuntime ? runtime : _regeneratorRuntime;
    
    var _module$1 = {
      get exports() {
        return _registry$1["0"];
      },
    
      set exports(_) {
        _registry$1["0"] = _;
      }
    
    };
    
    (function (module, exports) {
      module.exports = _regeneratorRuntime2;
    })(_module$1, _module$1.exports);
    
    var _regeneratorRuntime$1 = _module$1.exports;
    
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
    
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    
    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);
    
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
    
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
    
          _next(undefined);
        });
      };
    }
    
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    
    function _typeof(obj) {
      "@babel/helpers - typeof";
    
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }
    
      return _typeof(obj);
    }
    
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
    
      return self;
    }
    
    function _possibleConstructorReturn(self, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }
    
      return _assertThisInitialized(self);
    }
    
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }
    
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
    
      return _setPrototypeOf(o, p);
    }
    
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
    
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    
    /**
     * Check if a value is a function.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    function isFunction(obj) {
      return typeof obj === 'function';
    }
    /**
     * Check if a value is a string.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isString(obj) {
      return typeof obj === 'string';
    }
    /**
     * Check if a value is a number.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isNumber(obj) {
      return typeof obj === 'number' && !isNaN(obj);
    }
    /**
     * Check if a value is a date.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isDate(obj) {
      return obj instanceof Date;
    }
    /**
     * Check if a value is an object.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isObject(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    }
    /**
     * Check if a value is undefined.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isUndefined(obj) {
      return typeof obj === 'undefined';
    }
    /**
     * Check if a value is an array.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isArray(obj) {
      return Array.isArray(obj);
    }
    /**
     * Check if falsy value.
     *
     * @param {*} obj The value to check.
     * @return {Boolean}
     */
    
    function isFalsy(obj) {
      return isUndefined(obj) || obj === null || obj === false || typeof obj === 'number' && isNaN(obj);
    }
    
    /**
     * @module Proto
     */
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var create = Object.create;
    /**
     * Iterate all prototype chain of a class.
     * @memberof Proto
     *
     * @param {Function} Ctr The class to iterate.
     * @param {Function} [callback] A callback function for each prototype.
     * @return {Array<string>}
     */
    
    function walk(Ctr, callback) {
      var proto = Ctr.prototype;
    
      while (proto) {
        callback(proto);
        proto = Object.getPrototypeOf(proto.constructor).prototype;
      }
    }
    /**
     * Get all definitions for a given property in the prototype chain.
     * @memberof Proto
     *
     * @param {Function} Ctr The class to analyze.
     * @param {string} property The property name to collect.
     * @return {Array<Object>}
     */
    
    function reduce(Ctr, property) {
      var res = [];
      walk(Ctr, function (proto) {
        var descriptor = getOwnPropertyDescriptor(proto, property);
    
        if (descriptor) {
          res.push(descriptor);
        }
      });
      return res;
    }
    /**
     * Check if a method or a property is in the prototype chain.
     * @memberof Proto
     *
     * @param {Function} Ctr The class to analyze.
     * @param {string} property The property name to verify.
     * @return {Boolean}
     */
    
    function has(Ctr, property) {
      return !!reduce(Ctr, property).length;
    }
    /**
     * Retrieve prototype of an object.
     * @memberof Proto
     *
     * @param {Object} Ctr The object to analyze.
     * @return {Object} The prototype.
     */
    
    function get(Ctr) {
      if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(Ctr);
      }
    
      if (isObject(Ctr.__proto__)) {
        return Ctr.__proto__;
      }
    
      return Ctr.constructor.prototype;
    }
    /**
     * Create a new instance of an object without constructor.
     * @memberof Proto
     *
     * @param {Function|Object} Ctr The class or the prototype to reconstruct.
     * @return {Object} The new instance.
     */
    
    function reconstruct(Ctr) {
      if (isFunction(Ctr)) {
        return create(Ctr.prototype);
      } else if (Ctr === Array.prototype) {
        return [];
      }
    
      return create(Ctr);
    }
    
    /**
     * Useless callback function.
     * @private
     *
     * @param {*} scope The current object.
     * @param {string} key The current key.
     * @param {*} prop The current value.
     */
    
    function noop(scope, key, prop) {
      return prop;
    }
    /**
     * Clone an object.
     *
     * @method clone
     * @param {*} obj The instance to clone.
     * @param {Function} [callback] A modifier function for each property.
     * @param {Array} [cache] The cache array for circular references.
     * @return {*} The clone of the object.
     */
    
    
    function clone(obj) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    
      if (isArray(obj)) {
        return obj.map(function (entry, index) {
          entry = callback(obj, index, entry);
          return clone(entry, callback, cache);
        });
      } else if (isObject(obj)) {
        var cached = cache.indexOf(obj);
    
        if (cached !== -1) {
          return cache[cached + 1];
        }
    
        var res = reconstruct(get(obj));
        cache.push(obj, res);
        Object.keys(obj).forEach(function (k) {
          var val = callback(obj, k, obj[k]);
          res[k] = clone(val, callback, cache);
        });
        return res;
      } else if (isDate(obj)) {
        return new Date(obj.getTime());
      } else if (isFunction(obj)) {
        return obj;
      }
    
      return obj;
    }
    
    var defaults = {
      mergeObjects: true,
      joinArrays: false,
      strictMerge: false
    };
    /**
     * Merge two objects into a new one.
     *
     * @method merge
     * @param {...Object|Array} objects The objects to merge.
     * @return {Object} The merged object.
     */
    
    function merge() {
      var _this = this;
    
      var options = _this && _this.options || defaults;
    
    
      for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
      }
    
      var first = objects.shift();
      var res = clone(first);
      objects.forEach(function (obj2) {
        if (isObject(res) && isObject(obj2)) {
          Object.keys(obj2).forEach(function (key) {
            if (!options.strictMerge || first.hasOwnProperty(key)) {
              var entry = obj2[key];
    
              if (isObject(entry) && isObject(res[key]) && options.mergeObjects) {
                res[key] = merge.call(_this, res[key], entry);
              } else if (isArray(entry) && isArray(res[key]) && options.joinArrays) {
                res[key] = merge.call(_this, res[key], entry);
              } else {
                res[key] = clone(obj2[key]);
              }
            }
          });
        } else if (isArray(first) && isArray(obj2)) {
          obj2.forEach(function (val) {
            if (first.indexOf(val) === -1) {
              res.push(clone(val));
            }
          });
        } else {
          throw 'incompatible types';
        }
      });
      return res;
    }
    /**
     * Create a new Merge function with passed options.
     *
     * @method config
     * @memberof merge
     * @param {Object} options Merge options.
     * @param {Boolean} options.mergeObjects Should merge objects keys.
     * @param {Boolean} options.joinArrays Should join arrays instead of update keys.
     * @param {Boolean} options.strictMerge Should merge only keys which already are in the first object.
     * @return {Function} The new merge function.
     */
    
    merge.config = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
    
        return merge.call.apply(merge, [{
          options: merge(defaults, options)
        }].concat(args));
      };
    };
    
    var support = typeof Symbol === 'function';
    /**
     * Polyfill registry for symbols.
     * @private
     * @type {Array}
     */
    
    var registry = [];
    /**
     * Polyfill for Symbol.
     * @class SymbolPolyfill
     * @private
     *
     * @param {string} property The Symbol name.
     */
    
    var SymbolPolyfill = /*#__PURE__*/function () {
      function SymbolPolyfill(property) {
        _classCallCheck(this, SymbolPolyfill);
    
        var sym = this.SYM = "__".concat(property, "_").concat(registry.length);
        registry.push(sym);
        Object.defineProperty(Object.prototype, sym, {
          configurable: true,
          enumerable: false,
          set: function set(x) {
            Object.defineProperty(this, sym, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: x
            });
          }
        });
      }
    
      _createClass(SymbolPolyfill, [{
        key: "toString",
        value: function toString() {
          return this.SYM;
        }
      }]);
    
      return SymbolPolyfill;
    }();
    /**
     * Create a symbolic key for objects's properties.
     *
     * @param {string} property The Symbol name.
     * @return {Symbol|Symbolic}
     */
    
    
    function Symbolic(property) {
      if (support) {
        // native Symbol support.
        var sym = Symbol(property);
        registry.push(sym);
        return sym;
      }
    
      return new SymbolPolyfill(property);
    }
    /**
     * Check if an instance is a Symbol.
     * @param {Symbol|Symbolic} sym The symbol to check.
     * @return {Boolean}
     */
    
    Symbolic.isSymbolic = function (sym) {
      if (!sym) {
        return false;
      }
    
      if (sym instanceof SymbolPolyfill) {
        sym = sym.toString();
      }
    
      return registry.indexOf(sym) !== -1;
    };
    
    var MIXINS_SYM = Symbolic('mixins');
    /**
     * Mix a class with a mixin.
     * Inspired by Justin Fagnani (https://github.com/justinfagnani).
     *
     * @method mix
     * @param {Function} SuperClass The class to extend.
     * @return {MixinScope} A MixinScope instance.
     * @module mix
     */
    
    function mix(SuperClass) {
      return new MixinScope(SuperClass);
    }
    /**
     * A Mixin helper class.
     * @class MixinScope
     * @memberof mix
     */
    
    var MixinScope = /*#__PURE__*/function () {
      /**
       * Create a mixable class.
       * @private
       * @param {Function} superClass The class to extend.
       */
      function MixinScope(superClass) {
        _classCallCheck(this, MixinScope);
    
        this.superClass = superClass || /*#__PURE__*/function () {
          function _class() {
            _classCallCheck(this, _class);
          }
    
          return _class;
        }();
      }
      /**
       * Mix the super class with a list of mixins.
       * @memberof mix.MixinScope
       *
       * @param {...Function} mixins *N* mixin functions.
       * @return {Function} The extended class.
       */
    
    
      _createClass(MixinScope, [{
        key: "with",
        value: function _with() {
          var _this = this,
              _Class$MIXINS_SYM;
    
          var Class = this.superClass;
    
          for (var _len = arguments.length, mixins = new Array(_len), _key = 0; _key < _len; _key++) {
            mixins[_key] = arguments[_key];
          }
    
          mixins.forEach(function (mixin) {
            if (!_this.has(mixin)) {
              Class = mixin(Class);
            }
          });
          Class[MIXINS_SYM] = Class.hasOwnProperty(MIXINS_SYM) ? Class[MIXINS_SYM] : [];
    
          (_Class$MIXINS_SYM = Class[MIXINS_SYM]).push.apply(_Class$MIXINS_SYM, mixins);
    
          return Class;
        }
        /**
         * Check if the SuperClass has been already mixed with a mixin function.
         * @memberof mix.MixinScope
         *
         * @param {Function} mixin The mixin function.
         * @return {Boolean}
         */
    
      }, {
        key: "has",
        value: function has(mixin) {
          var Class = this.superClass;
    
          while (Class && Class !== Object) {
            var attached = Class[MIXINS_SYM] || [];
    
            if (attached.indexOf(mixin) !== -1) {
              return true;
            }
    
            Class = Object.getPrototypeOf(Class);
          }
    
          return false;
        }
      }]);
    
      return MixinScope;
    }();
    
    function isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;
    
      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }
    
    function _construct(Parent, args, Class) {
      if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }
    
      return _construct.apply(null, arguments);
    }
    
    function _superPropBase(object, property) {
      while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
      }
    
      return object;
    }
    
    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
      } else {
        _get = function _get(target, property, receiver) {
          var base = _superPropBase(target, property);
          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);
    
          if (desc.get) {
            return desc.get.call(receiver);
          }
    
          return desc.value;
        };
      }
    
      return _get(target, property, receiver || target);
    }
    
    /**
     * @module keypath
     */
    /**
     * Assert scope object is a valid object.
     * @private
     *
     * @param {*} obj The object to check
     * @return {boolean} The object is valid or not
     */
    
    function assertObject(obj) {
      return !isFalsy(obj) && typeof obj === 'object';
    }
    /**
     * Assert scope object and path are valid
     * @private
     *
     * @param {*} obj The object to check
     * @param {*} path The property path
     * @return {void}
     * @throws {Error} throw error when object scope is invalid undefined
     * @throws {Error} throw error when paths is invalid or undefined
     */
    
    
    function assertArgs(obj, path) {
      if (!assertObject(obj)) {
        throw new Error('invalid scope');
      }
    
      if (isFalsy(path) || isArray(path) && path.length === 0) {
        throw new Error('invalid path');
      }
    }
    /**
     * Normalize path argument in an array of paths
     * @private
     *
     * @param {Array|string|number} path The argument to normalize
     * @return {Array} An array of paths
     */
    
    
    function pathToArray(path) {
      if (isString(path)) {
        return path.split('.');
      }
    
      if (isNumber(path)) {
        return ["".concat(path)];
      }
    
      if (isArray(path)) {
        return path.slice(0);
      }
    
      return path;
    }
    /**
     * Get a deep property of an object using paths
     * @function get
     * @memberof keypath
     *
     * @param {Object} obj The object scope
     * @param {String|Array} path The path of the property to retrieve
     * @return {*} The property value
     * @throws {Error} throw error when object scope is undefined
     * @throws {Error} throw error when paths is invalid or undefined
     */
    
    
    function get$1(obj, path) {
      assertArgs(obj, path);
    
      if (!has$1(obj, path)) {
        return undefined;
      }
    
      var value = obj;
      path = pathToArray(path);
      path.forEach(function (prop) {
        value = value[prop];
      });
      return value;
    }
    /**
     * Set a deep property of an object using paths
     * @memberof keypath
     *
     * @param {Object} obj The object scope
     * @param {String|Array} path The path of the property to set
     * @param {*} value The value to set
     * @param {boolean} [ensure=true] Create path if does not exists
     * @return {*} The property value
     * @throws {Error} throw error when object scope is invalid undefined
     * @throws {Error} throw error when paths is invalid or undefined
     */
    
    function set(obj, path, value) {
      var ensure = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      assertArgs(obj, path);
      path = pathToArray(path);
    
      if (path.length === 1) {
        if (isArray(obj) && path[0] === '') {
          obj.push(value);
        } else {
          obj[path[0]] = value;
        }
    
        return value;
      }
    
      var current = path.shift();
      var currentObj;
    
      if (!obj.hasOwnProperty(current)) {
        if (ensure) {
          var next = path[0];
    
          if (isNaN(next) && next !== '') {
            currentObj = obj[current] = {};
          } else {
            currentObj = obj[current] = [];
          }
        }
      } else {
        currentObj = obj[current];
      }
    
      return set(currentObj, path, value, ensure);
    }
    /**
     * Check deep object property existence using paths
     * @memberof keypath
     *
     * @param {Object} obj The object scope
     * @param {String|Array} path The path of the property to retrieve
     * @return {boolean} The property exists or not
     * @throws {Error} throw error when object scope is invalid undefined
     * @throws {Error} throw error when paths is invalid or undefined
     */
    
    function has$1(obj, path) {
      if (!assertObject(obj)) {
        return false;
      }
    
      assertArgs(obj, path);
      path = pathToArray(path);
      var current = path.shift();
    
      if (isArray(obj) && !isNaN(current)) {
        current = parseInt(current);
    
        if (obj.length > current) {
          if (path.length === 0) {
            return true;
          }
    
          return has$1(obj[current], path);
        }
      }
    
      if (current in obj || obj.hasOwnProperty(current)) {
        if (path.length === 0) {
          return true;
        }
    
        return has$1(obj[current], path);
      }
    
      return false;
    }
    
    var SYM = Symbolic('listeners');
    /**
     * Add a callback for the specified trigger.
     *
     * @param {Object} scope The event scope
     * @param {String} name The event name
     * @param {Function} callback The callback function
     * @return {Function} Destroy created listener with this function
     */
    
    function on(scope, name, callback) {
      if (!isFunction(callback)) {
        throw new TypeError('callback is not a function');
      }
    
      scope[SYM] = scope[SYM] || {};
      var callbacks = scope[SYM];
      var evtCallbacks = callbacks[name] = callbacks[name] || [];
      evtCallbacks.push(callback);
      return off.bind(null, scope, name, callback);
    }
    /**
     * Remove one or multiple listeners.
     *
     * @param {Object} scope The event scope
     * @param {String} [name] Optional event name to reset
     * @param {Function} [callback] Callback to remove (empty, removes all listeners).
     */
    
    function off(scope, name, callback) {
      if (callback) {
        var callbacks = scope[SYM];
    
        if (callbacks) {
          var evtCallbacks = callbacks[name] = callbacks[name] || [];
          var io = evtCallbacks.indexOf(callback);
    
          if (io !== -1) {
            evtCallbacks.splice(io, 1);
          }
        }
      } else if (name) {
        var _callbacks = scope[SYM];
    
        if (_callbacks) {
          delete _callbacks[name];
        }
      } else {
        scope[SYM] = {};
      }
    }
    /**
     * Trigger a callback.
     *
     * @param {Object} scope The event scope
     * @param {String} name Event name
     * @param {...*} [args] Arguments to pass to callbacks
     * @return {Promise} The final Promise of the callbacks chain
     */
    
    function trigger(scope, name) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
    
      var callbacksList = scope.hasOwnProperty(SYM) && scope[SYM].hasOwnProperty(name) && scope[SYM][name] || [];
      var finalResults = callbacksList.slice(0).reduce(function (results, callback) {
        if (callbacksList.indexOf(callback) === -1) {
          // the callback has been removed from the callback list.
          return results;
        }
    
        var lastResult = results[results.length - 1];
        var result;
    
        if (lastResult instanceof Promise) {
          // wait for the previous result.
          result = lastResult.then(function () {
            return callback.call.apply(callback, [scope].concat(args));
          });
        } else {
          result = callback.call.apply(callback, [scope].concat(args));
        }
    
        results.push(result);
        return results;
      }, []);
      return Promise.all(finalResults);
    }
    
    var FACTORY_SYM = Symbolic('fsymbol');
    /**
     * Symbol for Factory context.
     * @memberof Factory
     * @type {Symbolic}
     */
    
    var CONTEXT_SYM = Symbolic('context');
    /**
     * Symbol for Factory configuration.
     * @memberof Factory
     * @type {Symbolic}
     */
    
    var CONFIG_SYM = Symbolic('config');
    /**
     * Symbol for Factory listeners.
     * @memberof Factory
     * @type {Symbolic}
     */
    
    var LISTENERS_SYM = Symbolic('listeners');
    var context;
    var FACTORY_SYMBOLS = {};
    /**
     * Base Factory mixin.
     * @memberof Factory
     * @mixin FactoryMixin
     *
     * @param {Function} SuperClass The class to mix.
     * @return {Function} A base Factory constructor.
     */
    
    var FactoryMixin = function FactoryMixin(SuperClass) {
      return (/*#__PURE__*/function (_SuperClass) {
          _inherits(_class, _SuperClass);
    
          _createClass(_class, null, [{
            key: "SYM",
    
            /**
             * A symbolic defintion for the Factory constructor.
             * @name BaseFactory.SYM
             * @type {Symbolic}
             * @memberof Factory.BaseFactory
             */
            get: function get() {
              if (!this.hasOwnProperty(FACTORY_SYM)) {
                var sym = Symbolic(this.name);
                FACTORY_SYMBOLS[sym] = this;
                this[FACTORY_SYM] = sym;
              }
    
              return this[FACTORY_SYM];
            }
          }]);
    
          function _class() {
            var _getPrototypeOf2, _this2;
    
            var _this;
    
            _classCallCheck(this, _class);
    
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
    
            _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
    
            (_this2 = _this).initialize.apply(_this2, args);
    
            return _this;
          }
          /**
           * @class BaseFactory
           * @memberof Factory
           *
           * @param {...*} [args] Arguments for super initialize.
           */
    
    
          _createClass(_class, [{
            key: "initialize",
            value: function initialize() {
              var _get2;
    
              if (!this[CONTEXT_SYM]) {
                this[CONTEXT_SYM] = context || this;
              }
    
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }
    
              return has(SuperClass, 'initialize') && (_get2 = _get(_getPrototypeOf(_class.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            }
            /**
             * Init a new Factory with the same context.
             * @memberof Factory.BaseFactory
             *
             * @param {Function} Factory The Factory constructor.
             * @param {...*} args A list of arguments for the constructor.
             * @return {Object} The new instance.
             */
    
          }, {
            key: "init",
            value: function init(Factory) {
              context = this[CONTEXT_SYM];
    
              for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }
    
              var res = _construct(Factory, args);
    
              context = null;
              return res;
            }
            /**
             * Clear the context.
             * @memberof Factory.BaseFactory
             */
    
          }, {
            key: "destroy",
            value: function destroy() {
              delete this[CONTEXT_SYM];
              return has(SuperClass, 'destroy') && _get(_getPrototypeOf(_class.prototype), "destroy", this).call(this);
            }
          }]);
    
          return _class;
        }(SuperClass)
      );
    };
    /**
     * Events emitter mixin.
     * @memberof Factory
     * @mixin EmitterMixin
     *
     * @param {Function} SuperClass The class to mix.
     * @return {Function} A Emitter constructor.
     */
    
    var EmitterMixin = function EmitterMixin(SuperClass) {
      return (/*#__PURE__*/function (_mix$with) {
          _inherits(_class2, _mix$with);
    
          function _class2() {
            _classCallCheck(this, _class2);
    
            return _possibleConstructorReturn(this, _getPrototypeOf(_class2).apply(this, arguments));
          }
    
          _createClass(_class2, [{
            key: "initialize",
    
            /**
             * @class Emitter
             * @memberof Factory
             * @implements FactoryMixin
             *
             * @param {...*} [args] Arguments for the constructor.
             */
            value: function initialize() {
              var _get3;
    
              for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }
    
              (_get3 = _get(_getPrototypeOf(_class2.prototype), "initialize", this)).call.apply(_get3, [this].concat(args));
    
              if (!this[LISTENERS_SYM]) {
                this[LISTENERS_SYM] = [];
              }
            }
            /**
             * Add an event listener.
             * @memberof Factory.Emitter
             *
             * @param {string} name The event name.
             * @param {Function} callback The callback to exec for the event.
             * @return {Function} A listener destroyer.
             */
    
          }, {
            key: "on",
            value: function on$1(name, callback) {
              return on(this, name, callback);
            }
            /**
             * Remove an event(s) listener(s).
             * @memberof Factory.Emitter
             *
             * @param {string} [name] The event name.
             * @param {Function} [callback] The optional callback to remove.
             */
    
          }, {
            key: "off",
            value: function off$1(name, callback) {
              return off(this, name, callback);
            }
            /**
             * Dispatch an event.
             * @memberof Factory.Emitter
             *
             * @param {string} name The event name.
             * @param {...*} args A list of arguments to pass to listeners.
             * @return {Promise} It resolves when all listeners have been triggered.
             */
    
          }, {
            key: "trigger",
            value: function trigger$1(name) {
              for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
              }
    
              return trigger.apply(void 0, [this, name].concat(args));
            }
            /**
             * Listen events from another object.
             * @memberof Factory.Emitter
             *
             * @param {Object} obj The object to listen.
             * @param {string} name The event name.
             * @param {Function} callback The callback to exec for the event.
             * @return {Function} A listener destroyer.
             */
    
          }, {
            key: "listen",
            value: function listen(obj, name, callback) {
              var destroyer = on(obj, name, callback);
    
              this[LISTENERS_SYM].push(destroyer);
              return destroyer;
            }
            /**
             * Unlisten event(s) from another object(s).
             * @memberof Factory.Emitter
             *
             * @param {Object} [obj] The object to unlisten.
             * @param {string} [name] The event name.
             * @param {Function} [callback] The callback to exec for the event.
             * @return {Function} A listener destroyer.
             */
    
          }, {
            key: "unlisten",
            value: function unlisten(obj, name, callback) {
              if (obj) {
                off(obj, name, callback);
              } else {
                this[LISTENERS_SYM].forEach(function (offListener) {
                  return offListener();
                });
                this[LISTENERS_SYM] = [];
              }
            }
            /**
             * Clear all listeners.
             * @memberof Factory.Emitter
             */
    
          }, {
            key: "destroy",
            value: function destroy() {
              this.off();
              this.unlisten();
              return _get(_getPrototypeOf(_class2.prototype), "destroy", this).call(this);
            }
          }]);
    
          return _class2;
        }(mix(SuperClass).with(FactoryMixin))
      );
    };
    /**
     * Configurable mixin.
     * @memberof Factory
     * @mixin ConfigurableMixin
     *
     * @param {Function} SuperClass The class to mix.
     * @return {Function} A Configurable constructor.
     */
    
    var ConfigurableMixin = function ConfigurableMixin(SuperClass) {
      return (/*#__PURE__*/function (_mix$with2) {
          _inherits(_class3, _mix$with2);
    
          function _class3() {
            _classCallCheck(this, _class3);
    
            return _possibleConstructorReturn(this, _getPrototypeOf(_class3).apply(this, arguments));
          }
    
          _createClass(_class3, [{
            key: "initialize",
    
            /**
             * @class Configurable
             * @memberof Factory
             * @implements FactoryMixin
             *
             * @property {Object} defaultConfig Default config object.
             *
             * @param {Object} [config] The instance configuration object.
             * @param {...*} [args] Other arguments for the super constructor.
             */
            value: function initialize(config) {
              var _get4;
    
              for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                args[_key6 - 1] = arguments[_key6];
              }
    
              (_get4 = _get(_getPrototypeOf(_class3.prototype), "initialize", this)).call.apply(_get4, [this, config].concat(args));
    
              if (!this[CONFIG_SYM]) {
                this[CONFIG_SYM] = clone(this.defaultConfig || {});
    
                if (config) {
                  this.config(config);
                }
              }
            }
          }, {
            key: "config",
    
            /**
             * Update instance configuration.
             * @memberof Factory.Configurable
             *
             * @param {Object|string} config The configuration to update (or the path of the configuration property).
             * @param {*} [value] The value to update for the given config name.
             * @return {Object} Final configuration of the instance.
             */
            value: function config(_config) {
              var current = this[CONFIG_SYM];
    
              if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 0 && isString(_config)) {
                return get$1(current, _config);
              }
    
              var value = arguments.length <= 1 ? undefined : arguments[1];
    
              if (isString(_config)) {
                var oldValue = get$1(current, _config);
    
                if (oldValue !== value) {
                  set(current, _config, value);
                  this.trigger('config:changed', _config, oldValue, value);
                }
              }
    
              if (isObject(_config)) {
                current = merge(current, _config);
              }
    
              this[CONFIG_SYM] = current;
              return current;
            }
            /**
             * Clear the configuration.
             * @memberof Factory.Configurable
             */
    
          }, {
            key: "destroy",
            value: function destroy() {
              delete this[CONFIG_SYM];
              return _get(_getPrototypeOf(_class3.prototype), "destroy", this).call(this);
            }
          }, {
            key: "defaultConfig",
            get: function get() {
              return {};
            }
          }]);
    
          return _class3;
        }(mix(SuperClass).with(FactoryMixin))
      );
    };
    /**
     * Mixin for other multiple injections.
     * @memberof Factory
     * @mixin InjectableMixin
     *
     * @param {Function} SuperClass The class to mix.
     * @return {Function} A Factory constructor.
     */
    
    var InjectableMixin = function InjectableMixin(SuperClass) {
      return (/*#__PURE__*/function (_mix$with3) {
          _inherits(_class4, _mix$with3);
    
          function _class4() {
            _classCallCheck(this, _class4);
    
            return _possibleConstructorReturn(this, _getPrototypeOf(_class4).apply(this, arguments));
          }
    
          _createClass(_class4, [{
            key: "initialize",
    
            /**
             * @class Factory
             * @memberof Factory
             * @implements FactoryMixin
             * @implements ConfigurableMixin
             * @implements EmitterMixin
             *
             * @property {Array} inject A default list of injections.
             *
             * @param {...*} [args] Arguments for the constructor.
             */
            value: function initialize() {
              var _get5,
                  _this3 = this;
    
              for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
              }
    
              (_get5 = _get(_getPrototypeOf(_class4.prototype), "initialize", this)).call.apply(_get5, [this].concat(args));
    
              var ctx = this[CONTEXT_SYM];
              this.inject.forEach(function (Injector) {
                if (Symbolic.isSymbolic(Injector)) {
                  Injector = FACTORY_SYMBOLS[Injector];
                }
    
                if (!_this3[Injector.SYM]) {
                  if (ctx) {
                    _this3[Injector.SYM] = ctx[Injector.SYM] = ctx[Injector.SYM] || _this3.init(Injector);
                  } else {
                    _this3[Injector.SYM] = _this3.init(Injector);
                  }
                }
              });
            }
          }, {
            key: "destroy",
    
            /**
             * Clear injected methods.
             * @memberof Factory.Factory
             */
            value: function destroy() {
              var _this4 = this;
    
              this.inject.forEach(function (Injector) {
                var SYM = Symbolic.isSymbolic(Injector) ? Injector : Injector.SYM;
                delete _this4[SYM];
              });
              return _get(_getPrototypeOf(_class4.prototype), "destroy", this).call(this);
            }
          }, {
            key: "inject",
            get: function get() {
              return [];
            }
          }]);
    
          return _class4;
        }(mix(SuperClass).with(FactoryMixin))
      );
    };
    var BaseFactory = /*#__PURE__*/function (_mix$with4) {
      _inherits(BaseFactory, _mix$with4);
    
      function BaseFactory() {
        _classCallCheck(this, BaseFactory);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(BaseFactory).apply(this, arguments));
      }
    
      return BaseFactory;
    }(mix().with(FactoryMixin));
    var Emitter = /*#__PURE__*/function (_mix$with5) {
      _inherits(Emitter, _mix$with5);
    
      function Emitter() {
        _classCallCheck(this, Emitter);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(Emitter).apply(this, arguments));
      }
    
      return Emitter;
    }(mix().with(EmitterMixin));
    var Configurable = /*#__PURE__*/function (_mix$with6) {
      _inherits(Configurable, _mix$with6);
    
      function Configurable() {
        _classCallCheck(this, Configurable);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(Configurable).apply(this, arguments));
      }
    
      return Configurable;
    }(mix().with(ConfigurableMixin));
    var Factory = /*#__PURE__*/function (_mix$with7) {
      _inherits(Factory, _mix$with7);
    
      function Factory() {
        _classCallCheck(this, Factory);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(Factory).apply(this, arguments));
      }
    
      return Factory;
    }(mix().with(EmitterMixin, ConfigurableMixin, InjectableMixin));
    
    /**
     * @typedef ChangeSet
     * @property {String} property The path to the changed property.
     * @property {*} oldValue The old value for the property.
     * @property {*} newValue The new value for the property.
     * @property {Array} added A list of added items to an array.
     * @property {Array} remove A list of remove items from an array.
     */
    
    /**
     * Observable Symbol.
     * @type {Symbolic}
     * @private
     */
    
    var OBSERVABLE_SYM = Symbolic('observable');
    
    var REF_SYM = Symbolic('ref');
    
    /* eslint-disable */
    
    /**
     * A class for single char analysis.
     * @class CharAnalyzer
     */
    var CharAnalyzer = /*#__PURE__*/function () {
      function CharAnalyzer() {
        _classCallCheck(this, CharAnalyzer);
      }
    
      _createClass(CharAnalyzer, null, [{
        key: "isWhiteSpace",
    
        /**
         * Check if char is a white space.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
        value: function isWhiteSpace(ch) {
          return this.WHITE_SPACES_REGEX.test(ch);
        }
        /**
         * Check if char is a new line.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
    
      }, {
        key: "isNewLine",
        value: function isNewLine(ch) {
          return this.NEW_LINE_REGEX.test(ch);
        }
        /**
         * Check if char is a punctuation char.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
    
      }, {
        key: "isPunctuation",
        value: function isPunctuation(ch) {
          return this.NOT_ALPHABET_REGEX.test(ch) && this.PUNCTUATION_REGEX.test(ch);
        }
        /**
         * Check if char is a sentence stop punctuation char.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
    
      }, {
        key: "isStopPunctuation",
        value: function isStopPunctuation(ch) {
          return this.STOP_PUNCTUATION_REGEX.test(ch);
        }
        /**
         * Check if char is a sentence start punctuation char.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
    
      }, {
        key: "isStartPunctuation",
        value: function isStartPunctuation(ch) {
          return this.START_PUNCTUATION_REGEX.test(ch);
        }
        /**
         * Check if char is a diacritic char.
         * @param {String} ch The char to analyze.
         * @return {Boolean}
         */
    
      }, {
        key: "isDiacritic",
        value: function isDiacritic(ch) {
          if (ch.length === 2) {
            return this.DIACRITICS_REGEX.test(ch[1]);
          }
    
          return this.NOT_ALPHABET_REGEX.test(ch) && this.DIACRITICS_REGEX.test(ch);
        }
      }]);
    
      return CharAnalyzer;
    }();
    /**
     * A regexp for white spaces reconition.
     * @type RegExp
     */
    
    CharAnalyzer.WHITE_SPACES_REGEX = /[\s\n\r]/;
    /**
     * A regexp for new lines reconition.
     * @type RegExp
     */
    
    CharAnalyzer.NEW_LINE_REGEX = /[\n|\r]/;
    /**
     * A regexp for punctuation reconition.
     * @type RegExp
     */
    
    CharAnalyzer.PUNCTUATION_REGEX = /(?:[\0-\x08\x0E-\x1F!-\/:-@\[-`\{-\x9F\xA1-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u0560\u0588-\u05CF\u05EB-\u05EF\u05F3-\u061F\u064B-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07C9\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u089F\u08B5\u08BE-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09EF\u09F2-\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B70\u0B72-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B-\u0C5F\u0C62-\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDD\u0CDF\u0CE2-\u0CF0\u0CF3-\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57-\u0D5E\u0D62-\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0E00\u0E31\u0E34-\u0E3F\u0E47-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0EDB\u0EE0-\u0EFF\u0F01-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u1040-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u169B-\u169F\u16EB-\u16F0\u16F9-\u16FF\u170D\u1712-\u171F\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u181F\u1878-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u194F\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19FF\u1A17-\u1A1F\u1A55-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4C-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BFF\u1C24-\u1C4C\u1C50-\u1C59\u1C7E\u1C7F\u1C89-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u2182\u2185-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u2FFF\u3001-\u3004\u3007-\u3030\u3036-\u303A\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u312F\u3130\u318F-\u319F\u31BB-\u31EF\u3200-\u33FF\u4DB6-\u4DFF\u9FEB-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA620-\uA629\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6E6-\uA716\uA720\uA721\uA789\uA78A\uA7AF\uA7B8-\uA7F6\uA802\uA806\uA80B\uA823-\uA83F\uA874-\uA881\uA8B4-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FE-\uA909\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9D0-\uA9DF\uA9E5\uA9F0-\uA9F9\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB66-\uAB6F\uABE3-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD\uFEFE\uFF00-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEFF\uDF20-\uDF2C\uDF41\uDF4A-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0-\uDFFF]|\uD801[\uDC9E-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE01-\uDE0F\uDE14\uDE18\uDE34-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE5-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC82\uDCB0-\uDCCF\uDCE9-\uDD02\uDD27-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDD9\uDDDB\uDDDD-\uDDFF\uDE12\uDE2C-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE7F\uDEAB-\uDEFF\uDF1A-\uDFFF]|\uD806[\uDC00-\uDC9F\uDCE0-\uDCFE\uDD00-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE84\uDE85\uDE8A-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC00-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD823-\uD82B\uD82D\uD82E\uD830-\uD834\uD836-\uD839\uD83C-\uD83F\uD87B-\uD87D\uD87F-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F-\uDECF\uDEEE-\uDEFF\uDF30-\uDF3F\uDF44-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDEFF\uDF45-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2-\uDFFF]|\uD821[\uDFED-\uDFFF]|\uD822[\uDEF3-\uDFFF]|\uD82C[\uDD1F-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC-\uDFFF]|\uD83A[\uDCC5-\uDCFF\uDD44-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
    /**
     * A regexp for stop punctuation reconition.
     * @type RegExp
     */
    
    CharAnalyzer.STOP_PUNCTUATION_REGEX = /[.!?;Î‡Â»]/;
    /**
     * A regexp for start punctuation reconition.
     * @type RegExp
     */
    
    CharAnalyzer.START_PUNCTUATION_REGEX = /[Â«Â¿Â¡]/;
    /**
     * A regexp for diacritics reconition.
     * @type RegExp
     */
    
    CharAnalyzer.DIACRITICS_REGEX = /(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDCA-\uDDCC\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDF00-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7\uDF1D-\uDF2B]|\uD806[\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF])/;
    /**
     * A regexp for not alphabet chars.
     * @type RegExp
     */
    
    CharAnalyzer.NOT_ALPHABET_REGEX = /[^a-zA-Z]/;
    
    var NodeParents = /*#__PURE__*/function () {
      function NodeParents(root, node) {
        _classCallCheck(this, NodeParents);
    
        this.root = root;
        this.node = node;
      }
    
      _createClass(NodeParents, [{
        key: "findCommon",
        value: function findCommon(nodeParents) {
          var p1 = this.parents;
          var p2 = nodeParents.parents;
          var res;
          p1.some(function (p) {
            if (p2.indexOf(p) !== -1) {
              res = p;
              return true;
            }
    
            return false;
          });
          return res;
        }
      }, {
        key: "getLower",
        value: function getLower(parent) {
          var p = this.parents;
          var io = p.indexOf(parent);
          return p[io - 1];
        }
      }, {
        key: "parents",
        get: function get() {
          var root = this.root;
          var node = this.node.parentNode;
          var parents = [];
    
          while (node !== root) {
            parents.push(node);
            node = node.parentNode;
          }
    
          parents.push(root);
          return parents;
        }
      }]);
    
      return NodeParents;
    }();
    
    /**
     * Create tagger span wrapper.
     * @private
     *
     * @param {string} tag The wrapper tagName.
     * @param {string} [className] The optional className for the wrapper.
     * @return {HTMLElement} The tagger span wrapper.
     */
    
    function createWrapper(tag, className) {
      var el = document.createElement(tag);
    
      if (className) {
        el.className = className;
      }
    
      return el;
    }
    
    function wrapElement(node, wrapper) {
      var parent = node.parentNode;
      parent.insertBefore(wrapper, node);
      wrapper.appendChild(node);
    }
    
    var includes = Array.prototype.includes || function (item) {
      return this.indexOf(item) !== -1;
    };
    
    function wrapElements(root, node1, node2, wrapper) {
      var parents1 = new NodeParents(root, node1);
      var parents2 = new NodeParents(root, node2);
      var parent = parents1.findCommon(parents2);
    
      if (parent) {
        var children = [];
        var node = node1;
    
        while (node) {
          var parents = new NodeParents(root, node);
          var before = parents.getLower(parent) || node;
    
          if (!includes.call(children, before)) {
            children.push(before);
          }
    
          if (node !== node2) {
            node = node.nextToken;
          } else {
            node = null;
          }
        }
    
        if (children[0]) {
          parent.insertBefore(wrapper, children[0]);
          children.forEach(function (child) {
            wrapper.appendChild(child);
          });
        }
      }
    }
    
    var TextPatch = /*#__PURE__*/function () {
      _createClass(TextPatch, null, [{
        key: "sort",
        value: function sort(patch1, patch2) {
          var start1 = patch1.start;
          var start2 = patch2.start;
    
          if (!start2) {
            return -1;
          }
    
          if (!start1) {
            return 1;
          }
    
          if (start1.indexToken > start2.indexToken) {
            return 1;
          } else if (start1.indexToken < start2.indexToken) {
            return -1;
          } else if (patch1.type > patch2.type) {
            return 1;
          } else if (patch1.type < patch2.type) {
            return -1;
          }
    
          return 0;
        }
      }]);
    
      function TextPatch(root, start, end) {
        _classCallCheck(this, TextPatch);
    
        this.root = root;
        this.setStart(start);
        this.setEnd(end);
      }
    
      _createClass(TextPatch, [{
        key: "setStart",
        value: function setStart(start) {
          this.start = start;
        }
      }, {
        key: "setEnd",
        value: function setEnd(end) {
          this.end = end;
        }
      }, {
        key: "exec",
        value: function exec() {
          return false;
        }
      }]);
    
      return TextPatch;
    }();
    var SentenceTextPatch = /*#__PURE__*/function (_TextPatch) {
      _inherits(SentenceTextPatch, _TextPatch);
    
      function SentenceTextPatch() {
        _classCallCheck(this, SentenceTextPatch);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(SentenceTextPatch).apply(this, arguments));
      }
    
      _createClass(SentenceTextPatch, [{
        key: "exec",
        value: function exec(_ref) {
          var tokenTag = _ref.tokenTag,
              tokenClass = _ref.tokenClass,
              tokenSentence = _ref.tokenSentence,
              useClasses = _ref.useClasses;
    
          if (this.start && this.end) {
            if (tokenSentence) {
              tokenClass += " ".concat(tokenSentence);
            }
    
            var wrapper = createWrapper(tokenTag, useClasses && tokenClass);
    
            if (this.start !== this.end) {
              wrapElements(this.root, this.start, this.end, wrapper);
            } else {
              wrapElement(this.start, wrapper);
            }
    
            this.wrapper = wrapper;
            return true;
          }
    
          return false;
        }
      }, {
        key: "type",
        get: function get() {
          return 0;
        }
      }]);
    
      return SentenceTextPatch;
    }(TextPatch);
    var SpeakingTextPatch = /*#__PURE__*/function (_TextPatch2) {
      _inherits(SpeakingTextPatch, _TextPatch2);
    
      function SpeakingTextPatch() {
        _classCallCheck(this, SpeakingTextPatch);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(SpeakingTextPatch).apply(this, arguments));
      }
    
      _createClass(SpeakingTextPatch, [{
        key: "exec",
        value: function exec(_ref2) {
          var tokenTag = _ref2.tokenTag,
              tokenClass = _ref2.tokenClass,
              tokenSpeaking = _ref2.tokenSpeaking,
              useClasses = _ref2.useClasses;
    
          if (this.start && this.end) {
            if (tokenSpeaking) {
              tokenClass += " ".concat(tokenSpeaking);
            }
    
            var wrapper = createWrapper(tokenTag, useClasses && tokenClass);
    
            if (this.start !== this.end) {
              wrapElements(this.root, this.start, this.end, wrapper);
            } else {
              wrapElement(this.start, wrapper);
            }
    
            this.wrapper = wrapper;
            return true;
          }
    
          return false;
        }
      }, {
        key: "type",
        get: function get() {
          return 1;
        }
      }]);
    
      return SpeakingTextPatch;
    }(TextPatch);
    var WordTextPatch = /*#__PURE__*/function (_TextPatch3) {
      _inherits(WordTextPatch, _TextPatch3);
    
      function WordTextPatch() {
        _classCallCheck(this, WordTextPatch);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(WordTextPatch).apply(this, arguments));
      }
    
      _createClass(WordTextPatch, [{
        key: "exec",
        value: function exec(_ref3) {
          var tokenTag = _ref3.tokenTag,
              tokenClass = _ref3.tokenClass,
              tokenWord = _ref3.tokenWord,
              useClasses = _ref3.useClasses;
    
          if (this.start && this.end) {
            if (tokenWord) {
              tokenClass += " ".concat(tokenWord);
            }
    
            var wrapper = createWrapper(tokenTag, useClasses && tokenClass);
    
            if (this.start !== this.end) {
              wrapElements(this.root, this.start, this.end, wrapper);
            } else {
              wrapElement(this.start, wrapper);
            }
    
            this.wrapper = wrapper;
            return true;
          }
    
          return false;
        }
      }, {
        key: "type",
        get: function get() {
          return 2;
        }
      }]);
    
      return WordTextPatch;
    }(TextPatch);
    var LetterTextPatch = /*#__PURE__*/function (_TextPatch4) {
      _inherits(LetterTextPatch, _TextPatch4);
    
      function LetterTextPatch() {
        _classCallCheck(this, LetterTextPatch);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(LetterTextPatch).apply(this, arguments));
      }
    
      _createClass(LetterTextPatch, [{
        key: "exec",
        value: function exec(_ref4) {
          var tokenTag = _ref4.tokenTag,
              tokenClass = _ref4.tokenClass,
              punctuationClass = _ref4.punctuationClass,
              sentenceStopClass = _ref4.sentenceStopClass,
              tokenLetter = _ref4.tokenLetter,
              useClasses = _ref4.useClasses;
    
          if (this.start) {
            var char = this.start.textContent;
            var isPunctuation = CharAnalyzer.isPunctuation(char);
    
            if (tokenLetter) {
              tokenClass += " ".concat(tokenLetter);
            }
    
            if (isPunctuation && punctuationClass) {
              tokenClass += " ".concat(punctuationClass);
            }
    
            if (isPunctuation && sentenceStopClass && CharAnalyzer.isStopPunctuation(char)) {
              tokenClass += " ".concat(sentenceStopClass);
            }
    
            var wrapper = createWrapper(tokenTag, useClasses && tokenClass);
            this.wrapper = wrapper;
            wrapElement(this.start, wrapper);
            return true;
          }
    
          return false;
        }
      }, {
        key: "type",
        get: function get() {
          return 3;
        }
      }]);
    
      return LetterTextPatch;
    }(TextPatch);
    
    var Counter = /*#__PURE__*/function () {
      function Counter() {
        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    
        _classCallCheck(this, Counter);
    
        this.c = start;
      }
    
      _createClass(Counter, [{
        key: "increase",
        value: function increase() {
          this.c++;
        }
      }, {
        key: "toString",
        value: function toString() {
          return this.c;
        }
      }]);
    
      return Counter;
    }();
    
    var MODES = {
      letter: 'letter',
      space: 'space',
      punctuation: 'punctuation',
      word: 'word',
      speaking: 'speaking',
      sentence: 'sentence'
    };
    var SYMBOLS = {
      isLast: '__isLast',
      isWhiteSpace: '__isWhiteSpace',
      isNewLine: '__isNewLine',
      isPunctuation: '__isPunctuation',
      isStopPunctuation: '__isStopPunctuation',
      isStartPunctuation: '__isStartPunctuation',
      isLetter: '__isLetter',
      isApostrophe: '__isApostrophe'
    };
    /**
     * Check if a mode is enabled.
     *
     * @param {Array<string>} list A list of active modes.
     * @param {...string} modes Modes to check.
     * @return {boolean}
     */
    
    function useModes(list) {
      for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
        if (list.indexOf(i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]) !== -1) {
          return true;
        }
      }
    
      return false;
    }
    /**
     * Check if a node is the last of a block ancestor.
     * @private
     *
     * @param {Node} node The node to check.
     * @param {Object} options Chunk options.
     * @return {Boolean}
     */
    
    
    function isLastBlockNode(node) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
      if (SYMBOLS.isLast in node) {
        return node[SYMBOLS.isLast];
      }
    
      node[SYMBOLS.isLast] = function () {
        if (!node.nextToken) {
          return true;
        }
    
        var scope = node;
        var iterateNode = node;
        var isLast = true;
    
        while (iterateNode) {
          if (isLast && iterateNode.nextSibling && iterateNode.nextSibling.matches && (iterateNode.nextSibling.matches(options.newLineSelector) || iterateNode.nextSibling.matches(options.excludeSelector))) {
            return true;
          }
    
          if (iterateNode.nodeType === Node.ELEMENT_NODE && iterateNode.matches(options.blockSelector)) {
            if (iterateNode.contains(scope.nextToken)) {
              return false;
            }
    
            return true;
          }
    
          isLast = isLast && !iterateNode.nextSibling;
          iterateNode = iterateNode.parentNode;
        }
    
        return false;
      }();
    
      return node[SYMBOLS.isLast];
    }
    /**
     * Check if a node contains whitespaces only.
     * @private
     *
     * @param {Node} node The node to check.
     * @return {Boolean}
     */
    
    
    function isWhiteSpace(node) {
      if (SYMBOLS.isWhiteSpace in node) {
        return node[SYMBOLS.isWhiteSpace];
      }
    
      node[SYMBOLS.isWhiteSpace] = CharAnalyzer.isWhiteSpace(node.textContent);
      return node[SYMBOLS.isWhiteSpace];
    }
    /**
     * Check if a node contains newline chars only.
     * @private
     *
     * @param {Node} node The node to check.
     * @return {Boolean}
     */
    
    
    function isNewLine(node) {
      if (SYMBOLS.isNewLine in node) {
        return node[SYMBOLS.isNewLine];
      }
    
      node[SYMBOLS.isNewLine] = !node.textContent.match(/[^\n]/) && CharAnalyzer.isNewLine(node.textContent);
      return node[SYMBOLS.isNewLine];
    }
    /**
     * Check if a node contains punctuation chars only.
     * @private
     *
     * @param {Node} node The node to check.
     * @return {Boolean}
     */
    
    
    function isPunctuation(node) {
      if (SYMBOLS.isPunctuation in node) {
        return node[SYMBOLS.isPunctuation];
      }
    
      node[SYMBOLS.isPunctuation] = CharAnalyzer.isPunctuation(node.textContent);
      return node[SYMBOLS.isPunctuation];
    }
    /**
     * Check if a node contains stop punctuation only.
     * @private
     *
     * @param {Node} node The node to check.
     * @return {Boolean}
     */
    
    
    function isStopPunctuation(node) {
      if (SYMBOLS.isStopPunctuation in node) {
        return node[SYMBOLS.isStopPunctuation];
      }
    
      node[SYMBOLS.isStopPunctuation] = CharAnalyzer.isStopPunctuation(node.textContent);
      return node[SYMBOLS.isStopPunctuation];
    }
    /**
     * Check if a node contains start punctuation only.
     * @private
     *
     * @param {Node} node The node to check.
     * @return {Boolean}
     */
    
    
    function isStartPunctuation(node) {
      if (SYMBOLS.isStartPunctuation in node) {
        return node[SYMBOLS.isStartPunctuation];
      }
    
      node[SYMBOLS.isStartPunctuation] = CharAnalyzer.isStartPunctuation(node.textContent);
      return node[SYMBOLS.isStartPunctuation];
    }
    /**
     * Check if a node contains valid letter only.
     * @private
     *
     * @param {Node} node The text node to check.
     * @return {boolean}
     */
    
    
    function isLetter(node) {
      if (SYMBOLS.isLetter in node) {
        return node[SYMBOLS.isLetter];
      }
    
      node[SYMBOLS.isLetter] = !isWhiteSpace(node) && !isPunctuation(node);
      return node[SYMBOLS.isLetter];
    }
    
    var APOSTROPHE_REGEX = /[â€™|']/;
    /**
     * Check if a node contains apostrophe only.
     * @private
     *
     * @param {Node} node The text node to check.
     * @return {boolean}
     */
    
    function isApostrophe(node) {
      if (SYMBOLS.isApostrophe in node) {
        return node[SYMBOLS.isApostrophe];
      }
    
      node[SYMBOLS.isApostrophe] = node.textContent.match(APOSTROPHE_REGEX);
      return node[SYMBOLS.isApostrophe];
    }
    /**
     * Convert HTML text to DocumentFragment.
     * @private
     *
     * @param {string} text An HTML string.
     * @return {DocumentFragment} A DocumentFragment wrapper.
     */
    
    
    function textToFragment(text) {
      var body = document.createElement('div');
      body.innerHTML = text;
      var fragment = document.createDocumentFragment();
    
      while (body.childNodes.length) {
        fragment.appendChild(body.childNodes[0]);
      }
    
      return fragment;
    }
    /**
     * Get a recursive list of text nodes in a Node.
     * @private
     *
     * @param {HTMLElement|DocumentFragment} root The root of the query.
     * @param {Node} node The current node to parse.
     * @param {Object} options Chunk options.
     * @return {Array} A recursive list of text nodes.
     */
    
    
    function findAllTextNodes(root, node) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var textNodes = [];
    
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
        var child = node.childNodes[i];
    
        if (child.nodeType === Node.TEXT_NODE) {
          if (!isNewLine(child)) {
            textNodes.push(child);
          }
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.matches(options.excludeSelector)) {
          textNodes.push.apply(textNodes, _toConsumableArray(findAllTextNodes(root, child, options)));
        }
      }
    
      return textNodes;
    }
    /**
     * Split a text node in single token chunks.
     * @private
     *
     * @param {Text} node The text node to split.
     * @param {Object} options Chunk options.
     * @return {Array} A list of chunks.
     */
    
    
    function splitTextNode(node, options) {
      var modes = options.modes;
      var text = node.textContent;
      var nodes = [];
      var token = '';
    
      for (var z = 0, len = text.length; z < len; z++) {
        var char = text[z];
        var nextChar = text[z + 1];
    
        if (nextChar && CharAnalyzer.isDiacritic(nextChar)) {
          char += nextChar;
          z++;
          nextChar = text[z + 1];
        }
    
        token += char;
        var split = void 0;
    
        if (z === len - 1) {
          split = true;
        } else if (useModes(modes, MODES.letter)) {
          split = true;
        } else if ((CharAnalyzer.isWhiteSpace(char) || CharAnalyzer.isWhiteSpace(nextChar)) && useModes(modes, MODES.space, MODES.word, MODES.speaking)) {
          split = true;
        } else if ((CharAnalyzer.isPunctuation(char) || CharAnalyzer.isPunctuation(nextChar)) && useModes(modes, MODES.speaking, MODES.word, MODES.punctuation)) {
          split = true;
        } else if (CharAnalyzer.isStopPunctuation(char) && useModes(modes, MODES.sentence)) {
          split = true;
        }
    
        if (split) {
          if (!node.previousSibling && !nodes.length) {
            token = token.replace(/^\s*/, '');
    
            if (!token) {
              continue;
            }
          }
    
          if (!node.nextSibling && z === len - 1) {
            token = token.replace(/\s*$/, '');
    
            if (!token) {
              continue;
            }
          }
    
          var textNode = document.createTextNode(token);
          nodes.push(textNode);
          token = '';
        }
      }
    
      return nodes;
    }
    /**
     * Replace a text node with its single character chunks.
     * @private
     *
     * @param {Text} node The text node to replace.
     * @param {Object} options Chunk options.
     * @return {Array} A list of chunks.
     */
    
    
    function replaceTextNode(node, options) {
      var nodes = splitTextNode(node, options);
      var parent = node.parentNode;
      var ref;
      nodes.forEach(function (child, index) {
        if (index === 0) {
          parent.replaceChild(child, node);
          ref = child.nextSibling;
        } else {
          if (ref) {
            parent.insertBefore(child, ref);
          } else {
            parent.appendChild(child);
          }
        }
      });
      return nodes;
    }
    /**
     * Get a list of ancestors for a node.
     * @private
     *
     * @param {Node} node The node.
     * @return {Array<Node>}
     */
    
    
    function getAncestors(node) {
      var res = [];
    
      while (node) {
        res.push(node);
        node = node.parentNode;
      }
    
      return res;
    }
    /**
     * Check if a chunk is wrappable.
     * @private
     *
     * @param {Node} first The first node of a chunk.
     * @param {Node} last The last node of a chunk.
     * @return {Boolean}
     */
    
    
    function isNotWrappable(first, last) {
      var parents1 = getAncestors(first);
      var parents2 = getAncestors(last);
    
      while (parents2.length < parents1.length) {
        var el = parents1.shift();
    
        if (el.previousSibling) {
          return true;
        }
      }
    
      return false;
    }
    /**
     * Get a list of patches for the given node.
     * @private
     *
     * @param {HTMLElement|DocumentFragment} root The root of the query.
     * @param {Node} node The text node to analyze.
     * @param {Object} options Chunk options.
     * @return {Array} A list of TextPatch-es.
     */
    
    
    function getPatches(root, node) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var modes = options.modes;
      var textNodes = [];
      findAllTextNodes(root, node, options).forEach(function (child) {
        if (child.textContent.trim() === '' && CharAnalyzer.isNewLine(child.textContent) && child.previousSibling === child.previousElementSibling && child.nextSibling === child.nextElementSibling) {
          return;
        }
    
        var children = replaceTextNode(child, options);
        textNodes.push.apply(textNodes, _toConsumableArray(children));
      });
      var last;
      textNodes.forEach(function (n, index) {
        if (last) {
          last.nextToken = n;
          n.prevToken = last;
        }
    
        n.indexToken = index;
        last = n;
      });
      var patches = [];
    
      if (useModes(modes, MODES.sentence)) {
        var desc = new SentenceTextPatch(node);
    
        for (var index = 0, len = textNodes.length; index < len; index++) {
          var child = textNodes[index];
          var nextIndex = index + 1;
          var next = textNodes[nextIndex];
    
          if (!desc.start && !isWhiteSpace(child)) {
            desc.setStart(child);
          }
    
          if (desc.start && (!next || isStartPunctuation(next) || isLastBlockNode(child, options) || isStopPunctuation(child) && !isPunctuation(next) && !isLetter(next) || isNotWrappable(desc.start, next))) {
            if (!isLastBlockNode(child, options)) {
              while (next && isStopPunctuation(next)) {
                nextIndex++;
                child = next;
                next = textNodes[nextIndex];
              }
            }
    
            index = nextIndex - 1;
            desc.setEnd(child);
            patches.push(desc);
            desc = new SentenceTextPatch(node);
          }
        }
      }
    
      if (useModes(modes, MODES.speaking)) {
        var _desc = new SpeakingTextPatch(node);
    
        textNodes.forEach(function (child, index) {
          var next = textNodes[index + 1];
    
          if (!_desc.start) {
            if (isLetter(child) || isStartPunctuation(child)) {
              _desc.setStart(child);
            } else if (isPunctuation(child)) {
              patches.push(new LetterTextPatch(node, child));
            }
          }
    
          if (_desc.start && (!next || isWhiteSpace(next) || isLastBlockNode(child, options) || isNotWrappable(_desc.start, next) || _desc.start.parentNode !== next.parentNode && next.parentNode.childNodes.length !== 1)) {
            _desc.setEnd(child);
    
            patches.push(_desc);
            _desc = new SpeakingTextPatch(node);
          }
        });
      }
    
      if (useModes(modes, MODES.word)) {
        var _desc2 = new WordTextPatch(node);
    
        textNodes.forEach(function (child, index) {
          var isLet = isLetter(child);
          var next = textNodes[index + 1];
    
          if (!_desc2.start && isLet) {
            _desc2.setStart(child);
          }
    
          if (_desc2.start && (isApostrophe(child) || !next || !isLetter(next) && !isApostrophe(next) || isLastBlockNode(child, options)) || isNotWrappable(_desc2.start, next)) {
            _desc2.setEnd(child);
    
            patches.push(_desc2);
            _desc2 = new WordTextPatch(node);
          }
        });
      }
    
      if (useModes(modes, MODES.letter)) {
        textNodes.forEach(function (child) {
          patches.push(new LetterTextPatch(node, child));
        });
      } else {
        if (useModes(modes, MODES.space)) {
          textNodes.forEach(function (child) {
            if (isWhiteSpace(child)) {
              patches.push(new LetterTextPatch(node, child));
            }
          });
        }
    
        if (useModes(modes, MODES.punctuation)) {
          textNodes.forEach(function (child) {
            if (isPunctuation(child)) {
              patches.push(new LetterTextPatch(node, child));
            }
          });
        }
      }
    
      (options.extraPatches || []).forEach(function (patch) {
        var res = patch(node, textNodes, options);
    
        if (Array.isArray(res)) {
          patches = patches.concat(res);
        }
      });
      return patches;
    }
    /**
     * Tag a XML node content.
     * @private
     *
     * @param {HTMLElement|DocumentFragment} root The root of the query.
     * @param {Node} node The node to tag.
     * @param {Object} options Chunk options.
     * @param {Counter} counter The chunks counter.
     * @return {string} The tagged XML content.
     */
    
    
    function chunkNode(root, node) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var counter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Counter();
      var patches = getPatches(root, node, options).filter(function (patch) {
        return patch.exec(options);
      });
    
      if (options.setId) {
        patches.sort(TextPatch.sort).forEach(function (patch) {
          var token = patch.wrapper;
          var id = options.id(patch, counter);
    
          if (id) {
            token.setAttribute(options.tokenIdAttr, id);
          }
    
          counter.increase();
        });
      }
    
      return node;
    }
    /**
     * Default chunk options.
     * @type {Object}
     * @private
     */
    
    
    var DEFAULTS = {
      setId: true,
      useClasses: false,
      modes: [MODES.letter],
      tokenIdAttr: 'data-token-id',
      tokenTag: 't:span',
      tokenClass: 'tagger--token',
      tokenLetter: 'tagger--letter',
      tokenWord: 'tagger--word',
      tokenSpeaking: 'tagger--speaking',
      tokenSentence: 'tagger--sentence',
      punctuationClass: 'tagger--token-punctuation',
      sentenceStopClass: 'tagger--token-sentence-stop',
      whiteSpaceClass: 'tagger--token-whitespace',
      excludeSelector: ['head', 'title', 'meta', 'script', 'style', 'img', 'audio', 'video', 'object', 'iframe', 'svg', '.tagger--disable'].join(', '),
      blockSelector: ['p', 'li', 'ul', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'tr', 'table', 'img', 'header', 'article'].join(', '),
      newLineSelector: 'br',
      id: function id(patch, index) {
        return index;
      },
      extraPatches: []
    };
    /**
     * chunk the text.
     *
     * @param {Element|String} element The element to chunk or HTML content.
     * @param {Object} options A set of options.
     * @property {Boolean} options.setId Should set the data token id attribute to the token element.
     * @property {Boolean} options.useClasses Should set the token class to the token element.
     * @property {String} options.mode The chunk method ("letter" or "word").
     * @property {String} options.tokenTag The chunk for the token element.
     * @property {String} options.tokenClass The class for the token element.
     * @property {String} options.puntuactionClass The class for the punctuation token element.
     * @property {String} options.sentenceStopClass The class for the stop punctuation token element.
     * @property {String} options.whiteSpaceClass The class for the white space token element.
     * @property {String} options.excludeSelector A selector to ignore on chunking.
     * @return {HTMLElement|DocumentFragment} The chunked document.
     */
    
    function chunk(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
      if (typeof element === 'string') {
        element = textToFragment(element);
      }
    
      options = merge(DEFAULTS, options);
      return chunkNode(element, element, options);
    }
    
    /**
     * @typedef {Object} SpeechToken
     * @property {HTMLElement} token The token element.
     * @property {HTMLElement} sentence The sentence parent element.
     * @property {string} text The text content of the token.
     * @property {number} start The initial character index of the token in the sentence.
     * @property {number} end The final character index of the token in the sentence.
     */
    
    /**
     * A model class which represents an utterance.
     * @fires Utterance#start
     * @fires Utterance#boundary
     * @fires Utterance#end
     */
    
    var Utterance = /*#__PURE__*/function (_Factory$Emitter) {
      _inherits(Utterance, _Factory$Emitter);
    
      /**
       * Create an Utterance instance.
       * @param {Array<SpeechToken>} tokens A list of tokens contained by the utterance.
       * @param {string} lang The utterance language.
       * @param {number} rate The utterance playback rate.
       */
      function Utterance(tokens, lang, rate) {
        var _this;
    
        _classCallCheck(this, Utterance);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Utterance).call(this));
        _this.tokens = tokens;
        _this.lang = lang;
        _this.rate = rate;
        return _this;
      }
      /**
       * Retrieve the tokens list.
       * @return {Array<SpeechToken>}
       */
    
    
      _createClass(Utterance, [{
        key: "getTokens",
        value: function getTokens() {
          return this.tokens;
        }
        /**
         * Get the first token of the utterance.
         * @return {SpeechToken}
         */
    
      }, {
        key: "getFirstToken",
        value: function getFirstToken() {
          return this.tokens[0];
        }
        /**
         * Get the last token of the utterance.
         * @return {SpeechToken}
         */
    
      }, {
        key: "getLastToken",
        value: function getLastToken() {
          return this.tokens[this.tokens.length - 1];
        }
        /**
         * Get the token at the given character index.
         * @param {number} charIndex
         * @return {SpeechToken} The found token at the given position.
         */
    
      }, {
        key: "getToken",
        value: function getToken(charIndex) {
          var token = this.tokens.find(function (_ref) {
            var start = _ref.start,
                end = _ref.end;
            return charIndex >= start && charIndex < end;
          });
    
          if (!token) {
            return null;
          }
    
          return token;
        }
        /**
         * Flags the utterance as started.
         * @return {Promise<void>}
         */
    
      }, {
        key: "started",
        value: function () {
          var _started = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee() {
            return _regeneratorRuntime$1.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return this.trigger('start');
    
                  case 2:
                    return _context.abrupt("return", _context.sent);
    
                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
    
          function started() {
            return _started.apply(this, arguments);
          }
    
          return started;
        }()
        /**
         * Trigger a token boundary during the speaking.
         * @return {Promise<void>}
         */
    
      }, {
        key: "boundary",
        value: function () {
          var _boundary = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee2(token) {
            return _regeneratorRuntime$1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return this.trigger('boundary', token);
    
                  case 2:
                    return _context2.abrupt("return", _context2.sent);
    
                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
    
          function boundary(_x) {
            return _boundary.apply(this, arguments);
          }
    
          return boundary;
        }()
        /**
         * Flags the utterance as ended.
         * @return {Promise<void>}
         */
    
      }, {
        key: "ended",
        value: function () {
          var _ended = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee3() {
            return _regeneratorRuntime$1.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return this.trigger('end');
    
                  case 2:
                    return _context3.abrupt("return", _context3.sent);
    
                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));
    
          function ended() {
            return _ended.apply(this, arguments);
          }
    
          return ended;
        }()
      }]);
    
      return Utterance;
    }(Emitter);
    
    /**
     * Abstract Text2Speech adapter.
     */
    var Adapter = /*#__PURE__*/function () {
      function Adapter() {
        _classCallCheck(this, Adapter);
      }
    
      _createClass(Adapter, [{
        key: "support",
    
        /**
         * Check if the adapter is supported by the browser.
         * @abstract
         * @return {Promise<boolean>}
         */
        value: function () {
          var _support = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee() {
            return _regeneratorRuntime$1.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    throw 'support method is not implemented';
    
                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));
    
          function support() {
            return _support.apply(this, arguments);
          }
    
          return support;
        }()
        /**
         * Cancel the current speaking.
         * @abstract
         * @return {Promise<void>}
         */
    
      }, {
        key: "cancel",
        value: function () {
          var _cancel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee2() {
            return _regeneratorRuntime$1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    throw 'cancel method is not implemented';
    
                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));
    
          function cancel() {
            return _cancel.apply(this, arguments);
          }
    
          return cancel;
        }()
        /**
         * Pause the current speaking.
         * @abstract
         * @return {Promise<void>}
         */
    
      }, {
        key: "pause",
        value: function () {
          var _pause = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee3() {
            return _regeneratorRuntime$1.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    throw 'pause method is not implemented';
    
                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));
    
          function pause() {
            return _pause.apply(this, arguments);
          }
    
          return pause;
        }()
        /**
         * Start or resume a speaking.
         * @abstract
         * @param {Array<import('./utterance.js').Utterance>} [utterances] A list of utterances to speak.
         * @return {Promise<void>}
         */
    
      }, {
        key: "play",
        value: function () {
          var _play = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee4(utterances) {
            return _regeneratorRuntime$1.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    throw 'play method is not implemented';
    
                  case 1:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));
    
          function play(_x) {
            return _play.apply(this, arguments);
          }
    
          return play;
        }()
        /**
         * Check if a token can be spoken by the adapter.
         * @param {HTMLElement} token The token to check.
         * @return {boolean}
         */
    
      }, {
        key: "canSpeech",
        value: function canSpeech(token) {
          return !!token;
        }
      }, {
        key: "paused",
    
        /**
         * Get the pause state of the adapter.
         * @type {boolean}
         */
        get: function get() {
          return true;
        }
      }]);
    
      return Adapter;
    }();
    
    /**
     * Speech synthesis voices loader is async in Chrome.
     * Promisify it.
     * @private
     * @type {Promise<Array<SpeechSynthesisVoice>>}
     */
    
    var VOICES_PROMISE = new Promise(function (resolve) {
      var getVoices = function getVoices() {
        var voices = speechSynthesis.getVoices();
    
        if (voices.length) {
          voices = _toConsumableArray(voices).filter(function (voice) {
            return voice.localService;
          });
          resolve(voices);
          return true;
        }
    
        return false;
      };
    
      if (!getVoices()) {
        speechSynthesis.onvoiceschanged = getVoices;
      }
    });
    /**
     * @typedef {Object} SynthesisOptions
     * @property {Array<string>} [preferredVoices] A list of preferred voice names to use.
     */
    
    /**
     * Default options for Synthesis adapter.
     * @type {SynthesisOptions}
     */
    
    var DEFAULT_OPTIONS = {
      preferredVoices: ['Alice', 'Amelie', 'Anna', 'Ellen', 'Fiona', 'Joana', 'Ioana', 'Monica', 'Karen', 'Luciana', 'Laura', 'Milena', 'Samantha', 'Sara']
    };
    /**
     * A Text2Speech adapter which uses native browser SpeechSynthesis.
     */
    
    var Synthesis = /*#__PURE__*/function (_Adapter) {
      _inherits(Synthesis, _Adapter);
    
      /**
       * Create an instance of the Synthesis adapter.
       * @param {SynthesisOptions} options A set of options for Synthesis.
       */
      function Synthesis() {
        var _this;
    
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    
        _classCallCheck(this, Synthesis);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Synthesis).call(this));
        _this.options = merge(DEFAULT_OPTIONS, options);
        return _this;
      }
      /**
       * @inheritdoc
       */
    
    
      _createClass(Synthesis, [{
        key: "support",
    
        /**
         * @inheritdoc
         */
        value: function () {
          var _support = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee() {
            return _regeneratorRuntime$1.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", !!speechSynthesis);
    
                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));
    
          function support() {
            return _support.apply(this, arguments);
          }
    
          return support;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "cancel",
        value: function () {
          var _cancel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee2() {
            var _this2 = this;
    
            var utterance;
            return _regeneratorRuntime$1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (this.currentSpeechUtterance) {
                      _context2.next = 3;
                      break;
                    }
    
                    speechSynthesis.cancel();
                    return _context2.abrupt("return");
    
                  case 3:
                    utterance = this.currentSpeechUtterance;
                    return _context2.abrupt("return", new Promise(function (resolve) {
                      delete _this2.currentSpeechUtterance;
                      utterance.addEventListener('end', function () {
                        return resolve();
                      });
                      speechSynthesis.cancel();
                    }));
    
                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
    
          function cancel() {
            return _cancel.apply(this, arguments);
          }
    
          return cancel;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "pause",
        value: function () {
          var _pause = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee3() {
            return _regeneratorRuntime$1.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    speechSynthesis.pause();
    
                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));
    
          function pause() {
            return _pause.apply(this, arguments);
          }
    
          return pause;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "play",
        value: function () {
          var _play = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee4(utterances) {
            return _regeneratorRuntime$1.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!utterances) {
                      _context4.next = 7;
                      break;
                    }
    
                    // store utterances queue.
                    this.utterances = utterances;
                    _context4.t0 = this;
                    _context4.next = 5;
                    return this.getVoices();
    
                  case 5:
                    _context4.t1 = _context4.sent;
                    return _context4.abrupt("return", _context4.t0.speakToken.call(_context4.t0, _context4.t1, 0));
    
                  case 7:
                    // Just resume the playback.
                    speechSynthesis.resume();
    
                  case 8:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));
    
          function play(_x) {
            return _play.apply(this, arguments);
          }
    
          return play;
        }()
        /**
         * Speak a token.
         * @param {Array<SpeechSynthesisVoice>} voices A list of available voices.
         * @param {number} index The index of the token to speech.
         * @return {void}
         */
    
      }, {
        key: "speakToken",
        value: function speakToken(voices, index) {
          var _this3 = this;
    
          var utterance = this.utterances[index];
          var text = utterance.getTokens().map(function (token) {
            return token.text;
          }).join(' ');
          var speechUtterance = new SpeechSynthesisUtterance(text); // we need to save a reference of the utterance in order to prevent gc. Â¯\_(ãƒ„)_/Â¯
    
          this.currentSpeechUtterance = speechUtterance; // listen SpeechSynthesisUtterance events in order to trigger Utterance callbacks
    
          speechUtterance.addEventListener('start', function () {
            utterance.started();
          });
          speechUtterance.addEventListener('boundary', function (_ref) {
            var charIndex = _ref.charIndex;
            utterance.boundary(utterance.getToken(charIndex));
          });
          speechUtterance.addEventListener('end', function () {
            if (!_this3.currentSpeechUtterance) {
              return;
            }
    
            delete _this3.currentSpeechUtterance;
            utterance.ended();
    
            if (index !== _this3.utterances.length - 1) {
              _this3.speakToken(voices, index + 1);
            }
          }); // setup utterance properties.
    
          var voice = this.getVoice(voices, utterance.lang);
          speechUtterance.voice = voice;
          speechUtterance.lang = voice.lang;
          speechUtterance.rate = utterance.rate; // add the utterance to the queue.
    
          speechSynthesis.speak(speechUtterance);
        }
        /**
         * Load and get speech synthesis voices.
         * @private
         * @return {Promise<Array<SpeechSynthesisVoice>>}
         */
    
      }, {
        key: "getVoices",
        value: function () {
          var _getVoices = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee5() {
            return _regeneratorRuntime$1.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return VOICES_PROMISE;
    
                  case 2:
                    return _context5.abrupt("return", _context5.sent);
    
                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));
    
          function getVoices() {
            return _getVoices.apply(this, arguments);
          }
    
          return getVoices;
        }()
        /**
         * Get a voice for the requested language.
         * @private
         * @param {Array<SpeechSynthesisVoice>} voices A list of available voices.
         * @param {string} lang The requested language.
         * @return {SpeechSynthesisVoice}
         */
    
      }, {
        key: "getVoice",
        value: function getVoice(voices, lang) {
          var preferredVoices = this.options.preferredVoices;
          lang = lang.toLowerCase().replace('_', '-');
          var availableVoices = voices.filter(function (voice) {
            var voiceLang = voice.lang.toLowerCase().replace('_', '-');
            var shortVoiceLang = voiceLang.split('-')[0];
            return voiceLang === lang || shortVoiceLang === lang;
          });
          return availableVoices.find(function (voice) {
            return preferredVoices.includes(voice.name);
          }) || availableVoices[0];
        }
        /**
         * @inheritdoc
         */
    
      }, {
        key: "canSpeech",
        value: function canSpeech(token) {
          return !token.closest('math, [data-mathml]');
        }
      }, {
        key: "paused",
        get: function get() {
          return speechSynthesis.paused;
        }
      }]);
    
      return Synthesis;
    }(Adapter); // ensure that speech synthesis is stop on page load.
    
    speechSynthesis.cancel(); // ensure that speech will stop on page unload.
    
    window.addEventListener('beforeunload', function () {
      speechSynthesis.cancel();
    });
    
    /**
     * Create an empty and hidden iframe.
     * @private
     * @return {HTMLIFrameElement}
     */
    
    function createEmptyIframe() {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
      iframe.width = '0';
      iframe.height = '0';
      iframe.style.display = 'none';
      return iframe;
    }
    /**
     * Add an hidden input with the given value to a form.
     * @private
     * @param {HTMLFormElement} form The form element to update.
     * @param {string} key The name of the input.
     * @param {string|number} value The value of the input.
     * @return {void}
     */
    
    
    function appendFormData(form, key, value) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = "".concat(value);
      form.appendChild(input);
    }
    /**
     * ReadSpeaker handles languages with format xx_xx.
     * Convert other formats to the supported one.
     * @private
     * @param {string} lang The lang string to conver.
     * @return {string} The supported lang string.
     */
    
    
    function toLanguage(lang) {
      return lang.toLowerCase().replace(/-/g, '_');
    }
    /**
     * @typedef {Object} ReadSpeechOptions
     * @property {string} customerid The customer id provided by ReadSpeaker.
     */
    
    /**
     * A Text2Speech adapter which uses ReadSpeaker api for audio and utterances generation.
     */
    
    
    var ReadSpeaker = /*#__PURE__*/function (_Adapter) {
      _inherits(ReadSpeaker, _Adapter);
    
      /**
       * Create an instance of the ReadSpeaker adapter.
       * @param {ReadSpeechOptions} options A set of options for ReadSpeaker.
       */
      function ReadSpeaker() {
        var _this;
    
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          customerid: null
        },
            customerid = _ref.customerid;
    
        _classCallCheck(this, ReadSpeaker);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(ReadSpeaker).call(this));
    
        if (!customerid) {
          throw 'missing ReadSpeaker customerid';
        }
    
        _this.customerid = customerid;
        _this._handleInitFrame = _this.handleInitFrame.bind(_assertThisInitialized(_this));
        _this._handleSyncFrame = _this.handleSyncFrame.bind(_assertThisInitialized(_this));
        return _this;
      }
      /**
       * @inheritdoc
       */
    
    
      _createClass(ReadSpeaker, [{
        key: "support",
    
        /**
         * @inheritdoc
         */
        value: function () {
          var _support = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee() {
            return _regeneratorRuntime$1.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", !!navigator.onLine);
    
                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));
    
          function support() {
            return _support.apply(this, arguments);
          }
    
          return support;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "cancel",
        value: function () {
          var _cancel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee2() {
            return _regeneratorRuntime$1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    // Clean up the adapter instance.
                    // Reset private properties and remove listeners and iframes.
                    delete this.postData;
                    delete this.syncData;
                    clearInterval(this.playInterval);
                    window.removeEventListener('message', this._handleInitFrame);
                    window.removeEventListener('message', this._handleSyncFrame);
    
                    if (this.syncFrame) {
                      if (this.syncFrame.parentNode) {
                        this.syncFrame.parentNode.removeChild(this.syncFrame);
                      }
    
                      delete this.syncFrame;
                    } // stop and remove the audio instance.
    
    
                    if (this.audio) {
                      this.audio.pause();
                      this.audio.src = '';
                      delete this.audio;
                    }
    
                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
    
          function cancel() {
            return _cancel.apply(this, arguments);
          }
    
          return cancel;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "pause",
        value: function () {
          var _pause = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee3() {
            return _regeneratorRuntime$1.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!this.audio) {
                      _context3.next = 2;
                      break;
                    }
    
                    return _context3.abrupt("return", this.audio.pause());
    
                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));
    
          function pause() {
            return _pause.apply(this, arguments);
          }
    
          return pause;
        }()
        /**
         * @inheritdoc
         */
    
      }, {
        key: "play",
        value: function () {
          var _play = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee5(utterances) {
            var _this2 = this;
    
            var count, map, html, speed, iframe, form;
            return _regeneratorRuntime$1.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!this.audio) {
                      _context5.next = 4;
                      break;
                    }
    
                    _context5.next = 3;
                    return this.playAudioPromise();
    
                  case 3:
                    return _context5.abrupt("return", {
                      src: this.audio.src,
                      download: this.audio.src.replace('nph-rspeak', 'nph-rspeak/save')
                    });
    
                  case 4:
                    this.utterances = utterances; // create the HTML chunk for ReadSpeaker.
                    // ReadSpeaker needs that words are wrapped by spans with class `sync_word` and sentences with `sync_sent`
                    // in order to retrieve boundaries informations.
    
                    count = 0;
                    map = this.syncMap = {};
                    html = utterances.map(function (utterance) {
                      var sentenceId = count++;
                      var tokens = utterance.getTokens();
                      var chunk = tokens.map(function (token) {
                        var charId = count++;
                        map[charId] = {
                          utterance: utterance,
                          token: token
                        };
                        return "<span class=\"sync_word\" id=\"sync".concat(charId, "\">").concat(token.text, "</span>");
                      }).join(' ');
                      return "<span class=\"sync_sent\" id=\"sync".concat(sentenceId, "\" lang=\"").concat(toLanguage(utterance.lang), "\">").concat(chunk, "</span>");
                    }).join('\n'); // the ReadSpeaker speed paramter uses percentage instead of relative values.
    
                    speed = 100;
    
                    if (utterances.length) {
                      speed = utterances[0].rate * 100;
                    } // create a resulting iframe for the ReadSpeaker api, loaded by a form's POST action.
    
    
                    iframe = createEmptyIframe();
                    form = document.createElement('form');
                    form.method = 'post';
                    form.action = "https://app-eu.readspeaker.com/enterprise/iframeproxy.php?rsent=rsent&version=2&randid=".concat(Math.random(), "&customerid=").concat(this.customerid);
                    iframe.id = iframe.name = form.target = 'rsiframe'; // add form data
    
                    appendFormData(form, 'customerid', this.customerid);
                    appendFormData(form, 'synccontainer', 'span');
                    appendFormData(form, 'url', location.href);
                    appendFormData(form, 'lang', 'en_gb');
                    appendFormData(form, 'speed', speed);
                    appendFormData(form, 'audioformat', 'mp3');
                    appendFormData(form, 'requestgrouptype', 'html5iframe');
                    appendFormData(form, 'requestgroup', Math.random());
                    appendFormData(form, 'chunk', 1);
                    appendFormData(form, 'sync', 'user');
                    appendFormData(form, 'output', 'audiolink');
                    appendFormData(form, 'html_base64', btoa(encodeURIComponent(html).replace(/%([0-9A-F]{2})/g, function (a, b) {
                      return String.fromCharCode("0x".concat(b));
                    })));
    
                    if (html.match(/<math/)) {
                      appendFormData(form, 'dict', 'math');
                      appendFormData(form, 'rule', 'math');
                      appendFormData(form, 'xslrule', 'math');
                    } // some devices policies prevent audio play if not triggered by an user action.
                    // being ReadSpeaker an asynchronous service, create an empty audio e play it with an interval in order to keep active the play session.
    
    
                    this.audio = new Audio();
                    this.playInterval = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee4() {
                      return _regeneratorRuntime$1.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!_this2.audio.src) {
                                _context4.next = 2;
                                break;
                              }
    
                              return _context4.abrupt("return", clearInterval(_this2.playInterval));
    
                            case 2:
                              _this2.playAudioPromise();
    
                            case 3:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4);
                    })), 250);
                    this.playAudioPromise();
                    document.body.appendChild(iframe); // setup a post message listener for the resulting iframe.
    
                    this.postData = [];
                    window.addEventListener('message', this._handleInitFrame); // add the form to the body, submit it and remove it.
    
                    document.body.appendChild(form);
                    form.submit();
                    document.body.removeChild(form); // resolves once the audio source had been loaded.
    
                    _context5.next = 39;
                    return new Promise(function (resolve) {
                      _this2.audio.ondurationchange = function () {
                        if (_this2.audio.duration) {
                          resolve({
                            src: _this2.audio.src,
                            download: _this2.audio.src.replace('nph-rspeak', 'nph-rspeak/save')
                          });
                        }
                      };
                    });
    
                  case 39:
                    return _context5.abrupt("return", _context5.sent);
    
                  case 40:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));
    
          function play(_x) {
            return _play.apply(this, arguments);
          }
    
          return play;
        }()
        /**
         * If HTMLAudioElement's play method return a Promise, wait its resolution.
         * @private
         * @return {Promise<void>}
         */
    
      }, {
        key: "playAudioPromise",
        value: function () {
          var _playAudioPromise = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee6() {
            var promise;
            return _regeneratorRuntime$1.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;
                    promise = this.audio.play();
    
                    if (!promise) {
                      _context6.next = 5;
                      break;
                    }
    
                    _context6.next = 5;
                    return promise;
    
                  case 5:
                    _context6.next = 9;
                    break;
    
                  case 7:
                    _context6.prev = 7;
                    _context6.t0 = _context6["catch"](0);
    
                  case 9:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this, [[0, 7]]);
          }));
    
          function playAudioPromise() {
            return _playAudioPromise.apply(this, arguments);
          }
    
          return playAudioPromise;
        }()
        /**
         * Handle message events from the resulting iframe.
         * @private
         * @param {MessageEvent} event The event dispatched by the iframe.
         * @return {Promise<void>}
         */
    
      }, {
        key: "handleInitFrame",
        value: function () {
          var _handleInitFrame = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee7(_ref3) {
            var _this3 = this;
    
            var data, origin, src, iframe;
            return _regeneratorRuntime$1.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    data = _ref3.data, origin = _ref3.origin;
    
                    if (!(origin !== 'https://app-eu.readspeaker.com')) {
                      _context7.next = 3;
                      break;
                    }
    
                    return _context7.abrupt("return");
    
                  case 3:
                    // collect message data.
                    // data are chunked as a list of descriptors and real data, eg ['rshlaudiostart', 'https://...mp3', 'rshlaudio']
                    this.postData.push(data);
    
                    if (!(data === 'rshlaudio')) {
                      _context7.next = 15;
                      break;
                    }
    
                    // the audio source had been collected.
                    src = this.postData[this.postData.length - 2];
    
                    if (src.match(/^https?:\/\//)) {
                      _context7.next = 8;
                      break;
                    }
    
                    return _context7.abrupt("return", this.cancel());
    
                  case 8:
                    // stop the empty audio playback.
                    clearInterval(this.playInterval);
                    this.audio.pause(); // bind the sync event for boundaries on audio time updates.
    
                    this.audio.ontimeupdate = this.sync.bind(this); // bind the audio end event for speaking cancelation.
    
                    this.audio.onended = function () {
                      if (_this3.current) {
                        _this3.current.utterance.ended();
    
                        delete _this3.current;
                      } else if (_this3.utterances.length) {
                        _this3.utterances[_this3.utterances.length - 1].ended();
                      }
                    }; // set the audio source.
    
    
                    this.audio.src = src;
                    _context7.next = 16;
                    break;
    
                  case 15:
                    if (data === 'rshlhtml5sync') {
                      // the iframe url for sync data is available.
                      // create a new sync iframe.
                      iframe = this.syncFrame = createEmptyIframe();
                      iframe.src = this.postData[this.postData.length - 2];
                      this.syncData = []; // we don't need the resulting iframe anymore.
    
                      window.removeEventListener('message', this._handleInitFrame); // listen messages from the new sync iframe.
    
                      window.addEventListener('message', this._handleSyncFrame);
                      document.body.appendChild(this.syncFrame);
                    }
    
                  case 16:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));
    
          function handleInitFrame(_x2) {
            return _handleInitFrame.apply(this, arguments);
          }
    
          return handleInitFrame;
        }()
        /**
         * Handle message events from the sync iframe.
         * @private
         * @param {MessageEvent} event The event dispatched by the sync iframe.
         * @return {Promise<void>}
         */
    
      }, {
        key: "handleSyncFrame",
        value: function () {
          var _handleSyncFrame = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee8(_ref4) {
            var data, origin, id, mapped;
            return _regeneratorRuntime$1.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    data = _ref4.data, origin = _ref4.origin;
    
                    if (!(origin !== 'https://rstts-eu.readspeaker.com')) {
                      _context8.next = 3;
                      break;
                    }
    
                    return _context8.abrupt("return");
    
                  case 3:
                    // collect message data.
                    // data are chunked as a list of descriptors and real data, eg [boundary time, boundary length, 'rshlsync', boundary time, boundary length, 'rshlsync', ...]
                    this.syncData.push(data);
    
                    if (!(data === 'rshlinit')) {
                      _context8.next = 9;
                      break;
                    }
    
                    _context8.next = 7;
                    return this.playAudioPromise();
    
                  case 7:
                    _context8.next = 10;
                    break;
    
                  case 9:
                    if (data === 'rshlsync') {
                      // a new boundary is available, add it to the sync map.
                      id = this.syncData[this.syncData.length - 2];
                      mapped = this.syncMap[id];
    
                      if (mapped) {
                        mapped.timestamp = parseInt(this.syncData[this.syncData.length - 4]);
                      }
                    }
    
                  case 10:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));
    
          function handleSyncFrame(_x3) {
            return _handleSyncFrame.apply(this, arguments);
          }
    
          return handleSyncFrame;
        }()
        /**
         * Sync bridge between ReadSpeaker boundaries and Speaker utterances.
         * @private
         */
    
      }, {
        key: "sync",
        value: function sync() {
          if (!this.audio) {
            // audio does not exist. Shit happens somehow.
            return;
          } // find the current boundary.
    
    
          var time = Math.floor(this.audio.currentTime * 1000);
          var map = Object.keys(this.syncMap);
          var current;
    
          for (var i = 0, len = map.length; i < len; i++) {
            var key = map[i];
            var item = this.syncMap[key];
    
            if (item.timestamp == null) {
              current = null;
              break;
            }
    
            if (item.timestamp > time) {
              break;
            }
    
            current = item;
          } // if a previous boundary exists, flag it as ended.
    
    
          if (this.current && current && this.current.utterance !== current.utterance) {
            this.current.utterance.ended();
            delete this.current;
          }
    
          if (current) {
            if (current.utterance.getFirstToken() === current.token) {
              // if the current boundary has not started yet, flag it.
              current.utterance.started();
            } // trigger a boundary for the current utterance.
    
    
            current.utterance.boundary(current.token);
            this.current = current;
          }
        }
        /**
         * @inheritdoc
         */
    
      }, {
        key: "canSpeech",
        value: function canSpeech(token) {
          // ReadSpeaker ignores elements with `rs_skip` class, so we do too.
          return !token.closest('.rs_skip');
        }
      }, {
        key: "paused",
        get: function get() {
          if (!this.audio) {
            return false;
          }
    
          return this.audio.paused;
        }
      }]);
    
      return ReadSpeaker;
    }(Adapter);
    
    /**
     * @typedef {Object} SpeechOptions
     * @property {number} rate The initial playback rate for the speaking.
     * @property {string} lang The default language.
     * @property {string} tokenActive The class for the active token.
     * @property {string} sentenceActive The class for the active sentence.
     * @property {string} tokenSelector A selector string for tokens that have to be spoken.
     * @property {string} sentenceSelector A selector string for sentences that have to be spoken.
     * @property {string} ignoreSelector A selector string for tokens to ignore.
     * @property {Array<string>} ariaAttributes A list of attributes which replaces token contents when spoken.
     * @property {Object} chunk A set of options for the chunk method (@see @chialab/text-helpers).
     */
    
    /**
     * Default options.
     * @type {SpeechOptions}
     * @private
     */
    
    var DEFAULT_OPTIONS$1 = {
      rate: 1,
      lang: document.documentElement.lang || navigator.language || 'en-US',
      tokenActive: 'speaker--word-active',
      sentenceActive: 'speaker--sentence-active',
      tokenSelector: '.tagger--speaking, [aria-label], [alt], math, [data-mathml]',
      sentenceSelector: '.tagger--sentence',
      ignoreSelector: '[aria-hidden]',
      ariaAttributes: ['aria-label', 'alt', 'data-mathml'],
      chunk: {
        useClasses: true,
        modes: ['speaking', 'sentence'],
        tokenSpeaking: 'tagger--speaking',
        tokenSentence: 'tagger--sentence'
      }
    };
    /**
     * A Text2Speech library which highlights words when an utterance is speaking.
     * It uses adapters for multiple implementations like native browser speech synthesis or ReadSpeaker.
     * It also uses the chunk method from the @chialab/text-helpers module for tokenization of the document.
     */
    
    var Speaker = /*#__PURE__*/function (_Factory$Emitter) {
      _inherits(Speaker, _Factory$Emitter);
    
      /**
       * Create a Speaker instance.
       * @param {HTMLElement} root The root element of the document to speak.
       * @param {Adapter} adapter The adapter to use. Default is native browser speech synthesis adapter.
       * @param {Object} options A set of options for the library.
       */
      function Speaker(root, adapter) {
        var _this;
    
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    
        _classCallCheck(this, Speaker);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Speaker).call(this));
    
        if (!(adapter instanceof Adapter)) {
          options = adapter;
          adapter = new Synthesis();
        }
    
        _this.element = root;
        _this.adapter = adapter;
        _this.options = merge(DEFAULT_OPTIONS$1, options);
        _this.rate = _this.options.rate;
        _this.lang = _this.options.lang;
        var chunkOptions = _this.options.chunk;
    
        if (chunkOptions) {
          chunk(root, chunkOptions);
        } // handle sync on boundary.
    
    
        _this.on('boundary', _this.onBoundary.bind(_assertThisInitialized(_this))); // clean up highlights on cancelation or end.
    
    
        _this.on('end', _this.clear.bind(_assertThisInitialized(_this)));
    
        _this.on('cancel', _this.clear.bind(_assertThisInitialized(_this)));
    
        return _this;
      }
      /**
       * The Speaker adapter to use.
       * @type {Adapter}
       */
    
    
      _createClass(Speaker, [{
        key: "cancel",
    
        /**
         * Cancel the current speech.
         * @return {Promise<void>}
         */
        value: function () {
          var _cancel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee() {
            return _regeneratorRuntime$1.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (this.active) {
                      _context.next = 2;
                      break;
                    }
    
                    throw 'missing active speech';
    
                  case 2:
                    _context.next = 4;
                    return this.adapter.cancel();
    
                  case 4:
                    _context.next = 6;
                    return this.trigger('cancel');
    
                  case 6:
                    return _context.abrupt("return", _context.sent);
    
                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
    
          function cancel() {
            return _cancel.apply(this, arguments);
          }
    
          return cancel;
        }()
        /**
         * Start or resume a speech.
         * @param {Range} [range] A selection range of tokens to speech.
         * @return {Promise<void>}
         */
    
      }, {
        key: "play",
        value: function () {
          var _play = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee2(range) {
            var _this2 = this;
    
            var active, paused, _data, tokens, queue, data;
    
            return _regeneratorRuntime$1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    active = this.active;
                    paused = this.paused;
                    this.range = range;
    
                    if (!active) {
                      _context2.next = 12;
                      break;
                    }
    
                    if (paused) {
                      _context2.next = 6;
                      break;
                    }
    
                    return _context2.abrupt("return");
    
                  case 6:
                    _context2.next = 8;
                    return this.adapter.play();
    
                  case 8:
                    _data = _context2.sent;
                    _context2.next = 11;
                    return this.trigger('play', _data);
    
                  case 11:
                    return _context2.abrupt("return", _context2.sent);
    
                  case 12:
                    if (!this.active) {
                      _context2.next = 15;
                      break;
                    }
    
                    _context2.next = 15;
                    return this.adapter.cancel();
    
                  case 15:
                    tokens = this.findTokens(range);
    
                    if (tokens.length) {
                      _context2.next = 21;
                      break;
                    }
    
                    _context2.next = 19;
                    return this.trigger('play');
    
                  case 19:
                    setTimeout(function () {
                      _this2.trigger('end');
                    });
                    return _context2.abrupt("return");
    
                  case 21:
                    queue = this.createQueue(tokens);
                    this.queue = queue;
                    this.syncQueue(queue);
                    _context2.next = 26;
                    return this.trigger('loading');
    
                  case 26:
                    _context2.next = 28;
                    return this.adapter.play(queue);
    
                  case 28:
                    data = _context2.sent;
                    _context2.next = 31;
                    return this.trigger('play', data);
    
                  case 31:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
    
          function play(_x) {
            return _play.apply(this, arguments);
          }
    
          return play;
        }()
        /**
         * Pause a speech.
         * @return {Promise<void>}
         */
    
      }, {
        key: "pause",
        value: function () {
          var _pause = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee3() {
            return _regeneratorRuntime$1.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (this.active) {
                      _context3.next = 2;
                      break;
                    }
    
                    throw 'missing active speech';
    
                  case 2:
                    _context3.next = 4;
                    return this.adapter.pause();
    
                  case 4:
                    _context3.next = 6;
                    return this.trigger('pause');
    
                  case 6:
                    return _context3.abrupt("return", _context3.sent);
    
                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));
    
          function pause() {
            return _pause.apply(this, arguments);
          }
    
          return pause;
        }()
        /**
         * Find speech tokens in the document.
         * @private
         * @param {Range} [range] A selection range of tokens to speech.
         * @return {Array<HTMLElement>} A list of tokens.
         */
    
      }, {
        key: "findTokens",
        value: function findTokens(range) {
          var _this3 = this;
    
          var _this$options = this.options,
              tokenSelector = _this$options.tokenSelector,
              ignoreSelector = _this$options.ignoreSelector;
          var tokens = [];
    
          if (!range) {
            tokens = _toConsumableArray(this.element.querySelectorAll(tokenSelector));
          } else {
            tokens = _toConsumableArray(range.commonAncestorContainer.querySelectorAll(tokenSelector)).filter(function (token) {
              return range.intersectsNode(token);
            });
          } // remove tokens that are child of another token
    
    
          tokens = tokens.filter(function (token) {
            var parent = token.parentNode;
            var parentToken = parent && parent.closest && parent.closest(tokenSelector);
    
            if (!parentToken) {
              return true;
            }
    
            return !tokens.includes(parentToken);
          });
    
          if (ignoreSelector) {
            // remove ignored tokens
            tokens = tokens.filter(function (token) {
              return !token.closest(ignoreSelector);
            });
          } // remove tokens that the adapter cannot speak
    
    
          tokens = tokens.filter(function (token) {
            return _this3.adapter.canSpeech(token);
          });
          return tokens;
        }
        /**
         * Create a queue of utterances.
         * It groups tokens by languages and sentences in order to create a list of utterances with sync data.
         * @private
         * @param {Array<HTMLElement>} words A list of word tokens for the speech.
         * @return {Array<Utterance>}
         */
    
      }, {
        key: "createQueue",
        value: function createQueue(words) {
          var _this4 = this;
    
          var _this$options2 = this.options,
              sentenceSelector = _this$options2.sentenceSelector,
              ariaAttributes = _this$options2.ariaAttributes;
          var currentLang;
          var currentSentence;
          var tokens = [];
          var currentText = '';
          var queue = [];
    
          var _loop = function _loop(index, len) {
            var token = words[index];
            var sentenceElement = token.closest(sentenceSelector);
    
            var langElement = token.closest('[lang]') || _this4.lang;
    
            var lang = function (language) {
              var splitted = language.split(/[-_]/);
              splitted[0] = splitted[0].substring(0, 2).toLowerCase();
    
              if (splitted[1]) {
                splitted[1] = splitted[1].substring(0, 2).toUpperCase();
              }
    
              return splitted.join('-');
            }(langElement && langElement.getAttribute('lang')) || _this4.lang;
    
            var text = function () {
              if (ariaAttributes) {
                for (var i = 0; i < ariaAttributes.length; i++) {
                  var attr = ariaAttributes[i];
    
                  if (token.hasAttribute(attr)) {
                    return token.getAttribute(attr);
                  }
                }
              }
    
              return token.innerText.trim();
            }();
    
            if ((!currentLang || currentLang === lang) && (!currentSentence || currentSentence === sentenceElement)) {
              var currentLength = currentText.length;
              currentLang = lang;
              currentSentence = sentenceElement;
    
              if (currentText.trim()) {
                currentLength += 1;
                currentText += " ".concat(text);
              } else {
                currentText += text;
              }
    
              tokens.push({
                token: token,
                sentence: sentenceElement,
                text: text,
                start: currentLength,
                end: currentText.length
              });
            } else if (currentLang !== lang || currentSentence !== sentenceElement) {
              var utterance = new Utterance(tokens, currentLang, _this4.rate);
              queue.push(utterance);
              currentLang = lang;
              currentText = text;
              currentSentence = sentenceElement;
              tokens = [{
                token: token,
                sentence: sentenceElement,
                text: text,
                start: 0,
                end: currentText.length
              }];
            }
    
            if (index === words.length - 1) {
              var _utterance = new Utterance(tokens, currentLang, _this4.rate);
    
              queue.push(_utterance);
            }
          };
    
          for (var index = 0, len = words.length; index < len; index++) {
            _loop(index);
          }
    
          return queue;
        }
        /**
         * Listens for adapter events in order to higlight current word and sentence.
         * @private
         * @param {Array<Utterance>} queue The queue of utterances to listen.
         * @return {void}
         */
    
      }, {
        key: "syncQueue",
        value: function syncQueue(queue) {
          var _this5 = this;
    
          // handle utterance events.
          queue.forEach(function (utterance, index) {
            utterance.on('boundary', function (token) {
              // a boundary had been met.
              _this5.trigger('boundary', token);
            });
            utterance.on('start', function () {
              // a boundary had started.
              _this5.trigger('boundary', utterance.getFirstToken());
            });
    
            if (index === queue.length - 1) {
              // when the last utterance ends, cancel the speech.
              utterance.on('end', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1.mark(function _callee4() {
                return _regeneratorRuntime$1.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _this5.adapter.cancel();
    
                      case 2:
                        _this5.trigger('end');
    
                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));
            }
          });
        }
        /**
         * Highlight current boundary.
         * @private
         * @param {import('./utterance.js').SpeechToken} token The new token.
         * @return {void}
         */
    
      }, {
        key: "onBoundary",
        value: function onBoundary(_ref2) {
          var token = _ref2.token,
              sentence = _ref2.sentence;
    
          if (!this.active) {
            return;
          }
    
          var _this$options3 = this.options,
              tokenActive = _this$options3.tokenActive,
              sentenceActive = _this$options3.sentenceActive; // highlight current token.
    
          this.clearStaus(token, sentence);
          this.currentSentence = sentence;
          this.currentToken = token;
    
          if (sentence && !this.range && !sentence.classList.contains(sentenceActive)) {
            sentence.classList.add(sentenceActive);
          }
    
          if (token && !token.classList.contains(tokenActive)) {
            token.classList.add(tokenActive);
          }
        }
        /**
         * Remove highlight classes.
         * @private
         * @param {HTMLElement} [token] The new token.
         * @param {HTMLElement} [sentence] The new sentence.
         * @return {void}
         */
    
      }, {
        key: "clearStaus",
        value: function clearStaus(token, sentence) {
          var _this$options4 = this.options,
              tokenActive = _this$options4.tokenActive,
              sentenceActive = _this$options4.sentenceActive;
          var currentToken = this.currentToken,
              currentSentence = this.currentSentence;
    
          if (currentSentence && !this.range && currentSentence !== sentence && currentSentence.classList.contains(sentenceActive)) {
            currentSentence.classList.remove(sentenceActive);
          }
    
          if (currentToken && currentToken !== token && currentToken.classList.contains(tokenActive)) {
            currentToken.classList.remove(tokenActive);
          }
        }
        /**
         * Clear the status of the Speaker.
         * @private
         * @return {void}
         */
    
      }, {
        key: "clear",
        value: function clear() {
          this.clearStaus();
          delete this.currentSentence;
          delete this.currentToken;
          delete this.queue;
          delete this.range;
        }
      }, {
        key: "adapter",
        get: function get() {
          return this._adapter;
        },
        set: function set(adapter) {
          var _this6 = this;
    
          var active = this.active;
          var paused = this.paused;
          var range = this.range;
          var cancelPromise = Promise.resolve();
    
          if (active) {
            cancelPromise = this.cancel();
          }
    
          this._adapter = adapter;
    
          if (active && !paused) {
            cancelPromise.then(function () {
              // restart the playback with the new adapter.
              _this6.play(range);
            });
          }
        }
        /**
         * The playback rate property.
         * @type {number}
         */
    
      }, {
        key: "rate",
        get: function get() {
          return this._rate;
        },
        set: function set(rate) {
          var _this7 = this;
    
          this._rate = rate;
          var active = this.active;
          var paused = this.paused;
          var range = this.range;
          var cancelPromise = Promise.resolve();
    
          if (active) {
            cancelPromise = this.adapter.cancel(false);
            this.clear();
          }
    
          if (active && !paused) {
            cancelPromise.then(function () {
              // restart the playback with the new rate.
              _this7.play(range);
            });
          }
        }
        /**
         * Flag for active speech.
         * @type {boolean}
         */
    
      }, {
        key: "active",
        get: function get() {
          return !!this.queue;
        }
        /**
         * Flag for paused speech.
         * @type {boolean}
         */
    
      }, {
        key: "paused",
        get: function get() {
          if (!this.adapter) {
            return false;
          }
    
          return this.adapter.paused;
        }
      }]);
    
      return Speaker;
    }(Emitter);
    
    exports.Adapter = Adapter;
    exports.ReadSpeaker = ReadSpeaker;
    exports.Speaker = Speaker;
    exports.Synthesis = Synthesis;
    
    Object.defineProperty(exports, '__esModule', { value: true });
    
    })));
    //# sourceMappingURL=speaker.js.map