list = [5, 2, 4, 3, 1];
s = new Date();

o = {};
function f(o, v) {
  if (o.v === undefined) {
    o.v = v;
  } else {
    if (o.v > v) {
      if (o.min === undefined) {
        o.min = {v: v};
      } else {
        f(o.min, v);
      }
    } else {
      if (o.max === undefined) {
        o.max = {v: v};
      } else {
        f(o.max, v);
      }
    }
  }
}

for (v of list) {
  f(o, v);
}

newList = []

function f2(o) {
  if (o.min) {
    f2(o.min);
  }
  newList.push(o.v);
  if (o.max) {
    f2(o.max);
  }
}

f2(o);

console.log(newList);

console.log(new Date() - s);
