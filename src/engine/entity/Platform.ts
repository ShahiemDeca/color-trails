import config from '@src/config';
import * as THREE from 'three';

interface PlatformInfo {
  positionY: number;
}

export default class Platform {
  amount: number = 0;
  platforms: any = [];
  obstacles: any = [];

  private createPlatformInfo(amount: number): PlatformInfo[] {
    const platforms: PlatformInfo[] = [];

    for (let i = 0; i < amount; i++) {
      const positionY = this.platforms.length * -config.platformStye.gap;

      platforms.push({ positionY });
      this.platforms.push({ positionY });
    }

    return platforms;
  }

  private createPlatformObstacles(platformInfo: PlatformInfo): THREE.Group {
    const obstaclesGroup = new THREE.Group();
    const numberOfPieces = config.colors.length;
    const piePieceAngle = (Math.PI * 2) / numberOfPieces;
    const shuffledColors = config.colors
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let i = 0; i < numberOfPieces; i++) {
      const startingAngle = i * piePieceAngle;

      const platformGeometry = new THREE.CylinderGeometry(
        config.platformStye.radius,
        config.platformStye.radius,
        config.platformStye.height,
        32,
        1,
        false,
        startingAngle,
        piePieceAngle
      );

      const platformMaterial = new THREE.MeshPhongMaterial({ color: shuffledColors[i] });
      const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
      const platform = new THREE.Object3D();
      platform.userData.index = obstaclesGroup.children.length;
      platform.add(platformMesh);
      Object.assign(platform, platformInfo);
      obstaclesGroup.add(platform);
    }

    obstaclesGroup.userData.index = this.obstacles.length;
    obstaclesGroup.position.y = platformInfo.positionY;

    return obstaclesGroup;
  }

  public movePlatforms() {
    this.platforms.forEach((platform: any) => platform.positionY += config.platformStye.gap);
    this.obstacles.forEach((platform: any) => platform.position.y += config.platformStye.gap);
  }

  public removeFirst(scene: THREE.Scene) {
    if(this.obstacles.length === 0) return;
    
    scene.remove(this.obstacles[0]);

    this.platforms.shift();
    this.obstacles.shift();
  }

  public render({ amount, scene }: { amount: number; scene: THREE.Scene }) {
    const platformInfos = this.createPlatformInfo(amount);
    platformInfos.forEach((platformInfo) => {
      const obstaclesGroup = this.createPlatformObstacles(platformInfo);
      this.obstacles.push(obstaclesGroup);

      scene.add(obstaclesGroup);
    });
  }
}
