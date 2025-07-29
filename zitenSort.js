list = [3, 4, 5, 1, 2];
newListList = [];
while (list.length) {
  console.log(list.join(","));
  let minObj = {
    index: 0,
    value: list[0]
  }
  let maxObj = {
    index: 0,
    value: list[0]
  }
  for (i = 1; i < list.length; i++) {
    if (list[i] < minObj.value) {
      minObj.index = i;
      minObj.value = list[i];
    }
    if (list[i] > maxObj.value) {
      maxObj.index = i;
      maxObj.value = list[i];
    }
  }
  if (minObj.index != maxObj.index) {
    newListList.push([minObj.value, maxObj.value]);
    if (minObj.index < maxObj.index) {
      list.splice(maxObj.index, 1);
      list.splice(minObj.index, 1);
    } else {
      list.splice(minObj.index, 1);
      list.splice(maxObj.index, 1);
    }

  } else {
    newListList.push([minObj.value]);
    list.splice(maxObj.index, 1);
  }
  console.log(list.join(","));
}
console.log(newListList);
while (newListList.length) {
  list.unshift(newListList[newListList.length - 1][0]);
  if (newListList[newListList.length - 1][1] !== undefined) {
    list.push(newListList[newListList.length - 1][1]);
  }
  newListList.pop();
}
console.log(list);
