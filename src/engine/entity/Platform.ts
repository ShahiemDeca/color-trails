import config from '@src/config';
import { MeshPhongMaterial, Scene, Mesh, CylinderGeometry, Group, Object3D } from 'three';

export default class Platform {

  public platforms: { positionY: number }[] = [];
  public obstacles: Group[] = [];

  private createPlatformInfo(amount: number) {
    const platforms = [];

    for (let i = 0; i < amount; i++) {
      const positionY = this.platforms.length * -config.platformStye.gap;
      platforms.push({ positionY });
      this.platforms.push({ positionY });
    }

    return platforms;
  }

  public shuffleColors(colors: string[]) {
    return colors.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  private createPlatformObstacles(platformInfo: { positionY: number; }): Group {
    const obstaclesGroup = new Group();
    const numberOfPieces = config.colors.length;
    const piePieceAngle = (Math.PI * 2) / numberOfPieces;
    const shuffledColors = this.shuffleColors(config.colors);

    for (let i = 0; i < numberOfPieces; i++) {
      const startingAngle = i * piePieceAngle;

      const centerAngle = startingAngle + piePieceAngle / 2;

      const platformGeometry = new CylinderGeometry(
        config.platformStye.radius,
        config.platformStye.radius,
        config.platformStye.height,
        32,
        1,
        false,
        centerAngle,
        piePieceAngle
      );

      const platformMaterial = new MeshPhongMaterial({ color: shuffledColors[i] });
      const platformMesh = new Mesh(platformGeometry, platformMaterial);
      const platform = new Object3D();
      platform.add(platformMesh);

      Object.assign(platform, platformInfo);
      obstaclesGroup.add(platform);
    }
    obstaclesGroup.position.y = platformInfo.positionY;
    return obstaclesGroup;
  }

  public movePlatforms() {
    this.platforms.forEach((platform: { positionY: number }) => platform.positionY += config.platformStye.gap);
    this.obstacles.forEach((obstacle: { position: { y: number } }) => obstacle.position.y += config.platformStye.gap);
  }

  public removeFirstPlatform(scene: Scene) {
    if (this.obstacles.length === 0) return;

    scene.remove(this.obstacles[0]);

    this.platforms.shift();
    this.obstacles.shift();
  }

  public render({ amount, scene }: { amount: number; scene: Scene }) {
    const platformInfos = this.createPlatformInfo(amount);
    platformInfos.forEach((platformInfo): void => {
      const obstaclesGroup = this.createPlatformObstacles(platformInfo);
      this.obstacles.push(obstaclesGroup);
      scene.add(obstaclesGroup);
    });
  }
}
