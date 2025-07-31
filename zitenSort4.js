list = [5, 3, 2, 4, 1, 6, 0];
while (true) {

  listDown = [];
  listUp = [];
  listUpFlg = false;
  listUpToDownFlg = false;
  for (i = 0; i < list.length - 1; i++) {
    if (list[i] <= list[i + 1]) {
      listDown.push(list[i]);
      if (listUpFlg) {
        listUpToDownFlg = true;
      }
    } else {
      listUp.push(list[i]);
      listUpFlg = true;
    }
  }
  if (listUpToDownFlg === false) {
    lastVal = list[list.length - 1];
    if (listDown.length && listUp.length) {
      if (listDown[0] > lastVal) {
        list = [lastVal, ...listDown, ...listUp];
      } else if (listUp[0] > lastVal) {
        list = [...listDown, lastVal, ...listUp];
      } else {
        list = [...listDown, ...listUp, lastVal];
      }
    } else if (listDown.length) {
      if (listDown[0] > lastVal) {
        list = [lastVal, ...listDown];
      } else {
        list = [...listDown, lastVal];
      }
    } else {
      if (listUp[0] > lastVal) {
        list = [lastVal, ...listUp];
      } else {
        list = [...listUp, lastVal];
      }
    }
    break;
  }
  list = [...listDown, ...listUp, list[list.length - 1]]
}
console.log(list);
