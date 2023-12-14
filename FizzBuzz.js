var v = 30;
console.log(
    (!(f = (v % 3)) | !(b = (v % 5)))
        ? !!f
	          ? "buzz"
            : !b
                ? "fizzbuzz"
                : "fizz"
      : "out"
);
