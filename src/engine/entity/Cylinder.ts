import { MeshPhongMaterial, Scene, Mesh, CylinderGeometry } from 'three';

export default class Cylinder {

  public render(scene: Scene) {
    const geometry = new CylinderGeometry(5, 5, 240, 32);
    const material = new MeshPhongMaterial({ color: 0xFFFFFF });
    const entity = new Mesh(geometry, material);

    scene.add(entity);
  }

}