const jType = {
    rock: 0,
    paper: 1,
    scissors: 2
};
const userInfo = {
    name: "",
    jType: -1
};
users = [];

const usersAdd = (name, jType) => {
    const user = Object.assign({}, userInfo);
    user.name = name;
    user.jType = jType;
    users.push(user);
};
usersAdd("太郎", jType.rock);
usersAdd("花子", jType.rock);
usersAdd("次郎", jType.scissors);

// パターン数チェック
const jTypeCheck = {
    rock: false,
    paper: false,
    scissors: false
};
for (let user of users) {
    if (user.jType == jType.rock) {
        jTypeCheck.rock = true;
    } else if (user.jType == jType.paper) {
        jTypeCheck.paper = true;
    } else if (user.jType == jType.scissors) {
        jTypeCheck.scissors = true;        
    }
}
let typeCount = 0;
for (let key in jTypeCheck) {
    if (jTypeCheck[key]) {
        typeCount++;
    }
}
if (typeCount == 1 || typeCount == 3) {
    console.log("あいこ");
} else {
    let t1 = -1;
    let t2 = -1;
    for (let key in jTypeCheck) {
        if (jTypeCheck[key]) {
            if (t1 == -1) {
                t1 = jType[key];
            } else {
                t2 = jType[key];
            }
        }
    }
    let isT1Win = false;
    if (t1 == jType.rock) {
        if (t2 == jType.paper) {
            isT1Win = false;
        } else {
            isT1Win = true;
        }
    } else if (t1 == jType.paper) {
        isT1Win = false;
    }

    for (let key in users) {
        console.log(`${users[key].name} さんは ${(users[key].jType == t1 && isT1Win) || (users[key].jType != t1 && !isT1Win) ? "勝ち" : "負け"}`);
    }
}
