ヌイカ2 = new class {
  の = new class {
    constructor(parent) {
      this.parent = parent;
    };
    ちんこ = new class {
      constructor(parent) {
        this.parent = parent;
      };
      の = new class {
        constructor(parent) {
          this.parent = parent;
        };
        大きさ = 12
      }(this);
      を = new class {
        constructor(parent) {
          this.parent = parent;
          this.半分に切る = () => this.parent.の.大きさ /= 2;
        };
      }(this);
    }(this);
  }(this);
};

console.log("切る前", ヌイカ2.の.ちんこ.の.大きさ);
ヌイカ2.の.ちんこ.を.半分に切る();
console.log("切った後", ヌイカ2.の.ちんこ.の.大きさ); 
