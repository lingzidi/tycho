export default class {

  static HalfPI = Math.PI / 2;

  static TAU = Math.PI * 2;
  
  static ramanujan(a, b) {
    const p = 3 * b + a;
    const q = 3 * a + b;
    const r = 3 * (a + b);

    return Math.PI * (Math.sqrt(p * q) - r);
  }

  static toRadians(deg) {
    return deg * Math.PI / 180;
  }

  static toDegrees(rad) {
    return (rad * 180) / Math.PI;
  }

  static arcSecToRad(time, rotation) {
    return this.toRadians(this.arcSecToDeg(time, rotation));
  }
 
  static arcSecToDeg(time, rotation) {
    return time * (rotation / 3600) % 360;
  }
}
