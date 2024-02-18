import config from '@src/config';
import { MeshPhongMaterial, SphereGeometry, Scene, Mesh, Color, Vector3, Sphere, Raycaster } from 'three';

export default class Ball {

  public entity: Mesh;
  public startPositionY: number = 30;
  public isBallDropping: boolean = false;
  public isIntersected: boolean = false;
  public isFirstFall: boolean = true;
  public isMatch: boolean = false;

  public render(scene: Scene) {
    const ballWidth = 2.5;
    const geometry = new SphereGeometry(ballWidth, 10, 32);
    const material = new MeshPhongMaterial({
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    });

    const entity = new Mesh(geometry, material);
    entity.position.set(1, this.startPositionY, 10);

    this.entity = entity;
    scene.add(entity);
  }

  public handleIntersection({ segments }: { segments: any[]}) {
    segments.forEach(segment => {
      const platformColor = segment.material.color.getHex();
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

  public handlePlatformCollision({ platforms }: { platforms: any }) {
    if (platforms.platforms.length === 0) return;

    const platform = platforms.obstacles[0];
    const obstacles = platform.children;
    const platformPosition = platforms.platforms[0].positionY + config.platformStye.height / 2;

    const platformY = platformPosition + 3;
    if (this.entity.position.y <= platformY && obstacles.length > 0) {
      this.isBallDropping = false;
      this.entity.position.y = platformY;

      // Handle intersection with platform
      const ballPosition = new Vector3();
      this.entity.getWorldPosition(ballPosition);

      const ballBoundingSphere = new Sphere(ballPosition, this.entity.geometry.parameters.radius);

      // Check if the ball is intersecting with the platform
      const raycaster = new Raycaster();
      raycaster.set(ballBoundingSphere.center, new Vector3(0, -1, 0));

      const intersectsLeft = raycaster.intersectObjects(obstacles);
      raycaster.set(ballBoundingSphere.center, new Vector3(-1, -1, 0));

      const intersectsRight = raycaster.intersectObjects(obstacles);

      const leftSegment = intersectsLeft.length > 0 ? intersectsLeft[0].object : null;
      const rightSegment = intersectsRight.length > 0 ? intersectsRight[0].object : null;

      if (leftSegment && rightSegment) this.handleIntersection({ segments: [leftSegment, rightSegment] });
    }
  }
}