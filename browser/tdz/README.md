# TDZ

```js
let x = 'outer value';
(function() {
  // start TDZ for x
  console.log(x);
  let x = 'inner value'; // declaration ends TDZ for x
}());
```

https://stackoverflow.com/questions/33198849/what-is-the-temporal-dead-zone