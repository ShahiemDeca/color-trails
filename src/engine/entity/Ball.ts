import config from '@src/config';
import { MeshPhongMaterial, SphereGeometry, Scene, Mesh, Color, Vector3, Sphere, Raycaster } from 'three';

export default class Ball {

  public entity: any;
  public startPositionY: number = 20;
  public isBallDropping: boolean = false;
  public isIntersected: boolean = false;
  public isFirstFall: boolean = true;
  public isMatch: boolean = false;

  public render(scene: Scene) {
    const geometry = new SphereGeometry(3, 10, 32);
    const material = new MeshPhongMaterial({
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    });

    console.log(config.colors[Math.floor(Math.random() * config.colors.length)])
    const entity = new Mesh(geometry, material);
    entity.position.set(0, this.startPositionY, 10);

    this.entity = entity;

    scene.add(entity);

  }

  public handleIntersection({ objects }: { objects: any }) {
    objects.forEach(object => {
      const platformColor = object.material.color.getHex();
      const currentBallColor = this.entity.material.color.getHex();
      if (platformColor === currentBallColor) this.isMatch = true;
    });

    this.isIntersected = true;
    this.isFirstFall = true;
  }

  public reset() {
    this.entity.position.y = this.startPositionY;
  }

  public drop(speed: number) {
    this.entity.position.y -= speed;
  }

  public changeColor() {
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    this.entity.material.color.set(new Color(color));
  }

  public handlePlatformCollision({ platforms, scene }: { platforms: any, scene: any }) {
    if (platforms.platforms.length === 0) return;

    const platform = platforms.obstacles[0];
    const obstacles = platform.children;
    const platformPosition = platforms.platforms[0].positionY + config.platformStye.height / 2;

    // todo: replace 3
    if (this.entity.position.y <= platformPosition + 3 && obstacles.length > 0) {
      this.isBallDropping = false;
      this.entity.position.y = platformPosition + 3;

      // Handle intersection with platform
      const ballPosition = new Vector3();
      this.entity.getWorldPosition(ballPosition);

      const ballBoundingSphere = new Sphere(ballPosition, this.entity.geometry.parameters.radius);

      const raycaster = new Raycaster();
      raycaster.set(ballBoundingSphere.center, new Vector3(0, -1, 0));

      const intersectsLeft = raycaster.intersectObjects(obstacles);
      raycaster.set(ballBoundingSphere.center, new Vector3(-1, -1, 0));

      const intersectsRight = raycaster.intersectObjects(obstacles);

      const leftObject = intersectsLeft.length > 0 ? intersectsLeft[0].object : null;
      const rightObject = intersectsRight.length > 0 ? intersectsRight[0].object : null;

      this.handleIntersection({ objects: [leftObject, rightObject] });
    }
  }
}