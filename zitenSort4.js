list = [5, 3, 2, 4, 1];
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
  list = [...listDown, list[list.length - 1], ...listUp]
  if (listUpToDownFlg === false) {
    break;
  }
}
console.log(list);
