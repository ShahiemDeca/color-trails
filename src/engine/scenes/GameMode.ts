import GameModeScreen from "@src/gui/GameModeScreen";
import { render } from "lit-html";
import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, Raycaster, DirectionalLight, AmbientLight, Mesh } from 'three';
import config from '../../config';
import Cylinder from "../entity/Cylinder";
import Ball from "../entity/Ball";
import Platform from "../entity/Platform";
import Score from "./Score";

export default class GameMode {

  public ballStartPositionY: number = 20;
  public isPlatformRotating: boolean = false;
  public gameModeScreen: GameModeScreen;

  private ballSpeed: number = 0.2;
  private initialBallFallDelay: number = config.ballFallDelay; // Initial ball fall delay
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private startTime: number = performance.now();
  private ball: Mesh;
  private platforms: Platform;
  isPaused: boolean = false;

  private isSceneHidden: boolean = false;
  private mismatchesCount: number = 0;
  private readonly mismatchesThreshold: number = 3;
  isGameEnded: boolean = false;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.platforms = new Platform();
    this.ball = new Ball();
    this.gameModeScreen = new GameModeScreen();
  }

  public startDragging() {
    this.isPlatformRotating = true;
  }

  public stopDragging() {
    this.isPlatformRotating = false;
  }

  public setEventListners() {
    window.addEventListener('resize', this.handleResize.bind(this));

    // Game events
    document.addEventListener('pause-game', this.togglePause.bind(this));
    document.addEventListener('reset-game', this.toggleReset.bind(this));
    document.addEventListener('quit-game', this.toggleQuit.bind(this));
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, { passive: false });

    // Events for desktop
    // document.addEventListener('mousedown', this.startDragging.bind(this));
    // document.addEventListener('mouseup', this.stopDragging.bind(this));
    // document.addEventListener('mousemove', this.movePlatform.bind(this));

    // Touch events for mobile devices
    document.addEventListener('touchstart', this.startDragging.bind(this));
    document.addEventListener('touchend', this.stopDragging.bind(this));
    document.addEventListener('touchmove', this.movePlatform.bind(this));
  }

  public toggleQuit() {
    document.body.removeChild(this.renderer.domElement);

    // Reset the game state
    // this.isGameEnded = false;
    // this.isPaused = false;
    // this.mismatchesCount = 0;
    // this.gameModeScreen.score = 0;
    // this.initialBallFallDelay = config.ballFallDelay;

    // this.toggleSceneVisibility();
    // this.setGameInterface();
  }

  public toggleReset() {
    if (!this.isGameEnded) return;

    // Reset the game state
    this.isGameEnded = false;
    this.isPaused = false;
    this.mismatchesCount = 0;
    this.gameModeScreen.score = 0;
    this.initialBallFallDelay = config.ballFallDelay;

    this.toggleSceneVisibility();
    this.setGameInterface();
  }

  public togglePause() {
    this.isPaused = !this.isPaused;

    this.toggleSceneVisibility();

    if (!this.isSceneHidden) {
      this.setGameInterface();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  public toggleSceneVisibility() {
    this.isSceneHidden = !this.isSceneHidden;
    this.scene.visible = !this.isSceneHidden;
  }

  public handleResize() {
    // Update camera aspect ratio and renderer size when the window is resized
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public setCamera() {
    this.camera.position.z = 150;
    this.camera.position.y = 60;
    this.camera.rotation.set(-0.5, 0, 0);
  }

  public setGameInterface() {
    render(this.gameModeScreen, document.getElementById('app'));
  }

  public setRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  public addCylinder() {
    const cylinder = new Cylinder();
    cylinder.render(this.scene);
  }

  public addBall() {
    this.ball.render(this.scene);
  }

  public addPlatform({ amount }: { amount: number }) {
    this.platforms.render({ amount, scene: this.scene });
  }

  public platformUnderMouse(clientX: number, clientY: number) {

    return this.platforms.obstacles[0];
  }

  public movePlatform(event: any) {
    const platform = this.platformUnderMouse(event.clientX, event.clientY);

    // Check if platform is not undefined
    if (platform) {
      const platformCenterX = window.innerWidth / 2;
      const mouseDirection = (event.touches[0].clientX - platformCenterX) > 0 ? 1 : -1;

      const sensitivity = 0.06; // Adjust the sensitivity for rotation
      platform.rotation.y += sensitivity * mouseDirection;
    }

  }

  public onGameEnd() {
    const score = new Score();
    score.start({ score: this.gameModeScreen.score });

    this.toggleSceneVisibility();

    this.isPaused = true;
    this.isGameEnded = true;
  }

  public start() {
    this.setGameInterface();
    this.setEventListners();
    this.setCamera();
    this.setRenderer();

    // Add game objects
    this.addCylinder();
    this.addBall();
    this.addPlatform({ amount: 4 });

    const light = new DirectionalLight(0xffffff, 10);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    // Add ambient light
    const ambientLight = new AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
    // Game loop
    this.update(performance.now());
  }

  public update = (timestamp: number) => {
    requestAnimationFrame(this.update);

    if (this.isPaused || this.isGameEnded) return;

    // Check if the ball is falling
    const deltaTime = (timestamp - this.startTime) / 1000;
    if (deltaTime >= this.initialBallFallDelay && this.ball && this.ball.isFirstFall) {
      this.ball.isBallDropping = true;
      this.ball.isFirstFall = false;
      this.startTime = timestamp;
    }

    if (this.ball?.isBallDropping) {
      const currentScore = this.gameModeScreen.score;
      // const increasedSpeed = 0.2 * Math.floor(currentScore / 5); // Increase speed every 5 points
      const totalSpeed = this.ballSpeed;
      const increasedFallDelay = 0.01 * Math.floor(currentScore / 5); // Increase delay every 10 points
      this.initialBallFallDelay = this.initialBallFallDelay - increasedFallDelay;

      // this.ball.drop(totalSpeed);
      this.ball.handlePlatformCollision({ platforms: this.platforms, scene: this.scene });

      if (this.ball.isIntersected) {
        this.platforms.movePlatforms();
        this.platforms.removeFirst(this.scene);

        this.addPlatform({ amount: 1 });

        this.ball.changeColor();
        this.ball.reset();
        this.ball.isIntersected = false;

        if (this.ball.isMatch) {
          this.gameModeScreen.score += 1;
          this.gameModeScreen.requestUpdate('score', 0);

          this.ball.isMatch = false;
        } else {
          this.mismatchesCount += 1;
          if (this.mismatchesCount >= this.mismatchesThreshold) this.onGameEnd();
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}