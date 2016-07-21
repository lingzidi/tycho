export class OrbitalController {
  constructor(OrbitalService) {
    this.service = OrbitalService;
    this.orbital = this.service.getOrbital(data);
  }
}