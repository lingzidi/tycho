export default class {

  static magnitude(v) {
    return Math.sqrt(
      this.squareSum(v)
    );
  }

  static squareSum(v) {
    return ['x', 'y', 'z']
      .reduce((sum, c) => {
        if(isNaN(v[c]) ){
          return sum;
        }
        return sum + this.square(v[c]);
      }, 0);
  }

  static square(x) {
    return Math.pow(x, 2);
  }

  static getFocus(x, y) {
    return Math.sqrt(this.square(x) - this.square(y));
  }
}