import _ from 'lodash-es';

/*
https://github.com/SeregPie/lodash.combinations

MIT License

Copyright (c) 2017-2022 Sergej Sintschilin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const combinations = (collection, n) => {
  const array = _.values(collection);
  if (array.length < n) {
    return [];
  }
  const recur = (array, n) => {
    if (--n < 0) {
      return [[]];
    }
    const combinations = [];
    array = array.slice();
    while (array.length - n) {
      const value = array.shift();
      recur(array, n).forEach(combination => {
        combination.unshift(value);
        combinations.push(combination);
      });
    }
    return combinations;
  };
  return recur(array, n);
};

_.mixin({ combinations });
