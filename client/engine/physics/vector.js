export default class {
  static magnitude(v) {
    if(v) {
      if(!isNaN(v.x) && !isNaN(v.y)) {
        var sum = Math.pow(v.x, 2) + Math.pow(v.y, 2);
        sum += (!isNaN(v.z) ? v.z : 0);
        
        return Math.sqrt(sum);
      }
    }
    return 0;
  }

  static square(x) {
    return Math.pow(x, 2);
  }

  static getFocus(x, y) {
    return Math.sqrt(this.square(x) - this.square(y));
  }
}