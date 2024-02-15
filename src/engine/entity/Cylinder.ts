import * as THREE from 'three';

export default class Cylinder {

  public render(scene: THREE.Scene) {
    const geometry = new THREE.CylinderGeometry(5, 5, 240, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, });
    const entity = new THREE.Mesh(geometry, material);
    
    scene.add(entity);
  }

}