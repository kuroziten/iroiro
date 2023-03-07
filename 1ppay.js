const befList = [5,4,2,3,1,6,8,7,5];
const aftList = [];
for (bef of befList) {
    if (aftList.length == 0) {
        aftList.push(bef);
    } else {
        let notAdd = true;
        for (i = 0; i < aftList.length; i++) {
            const aft = aftList[i];
            if (aft >= bef) {
                aftList.splice(i,0,bef);
                notAdd = false;
                break;
            }
        }
        if (notAdd) {
            aftList.push(bef);
        }
    }
    
}
aftList;
