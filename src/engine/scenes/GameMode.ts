import GameModeScreen from "@src/gui/GameModeScreen";
import { render } from "lit-html";
import { Scene, PerspectiveCamera, WebGLRenderer, Audio, AudioListener, AudioLoader, DirectionalLight, AmbientLight, Mesh } from 'three';
import config from '../../config';
import Cylinder from "../entity/Cylinder";
import Ball from "../entity/Ball";
import Platform from "../entity/Platform";
import Score from "./Score";
import hyper from '../../assets/hyper.mp3';
import Game from "../Game";

export default class GameMode {

  public isPlatformRotating: boolean = false;

  private startTime: number = performance.now();

  private gameModeScreen: GameModeScreen;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  
  private ball: Mesh;
  private platforms: Platform;
  private audio: Audio;

  private isPaused: boolean = false;
  private isSceneHidden: boolean = false;
  private isGameEnded: boolean = false;

  private mismatchesCount: number = 0;

  private initialBallFallDelay: number = config.ballFallDelay;
  private readonly mismatchesThreshold: number = 3;
  private readonly ballSpeed: number = config.ballSpeed;

  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.platforms = new Platform();
    this.ball = new Ball();
    this.gameModeScreen = new GameModeScreen();
  }

  public loadAudio() {
    const listener = new AudioListener();
    this.camera.add(listener);

    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();
    audioLoader.load(hyper, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    this.audio = sound;
  }

  public startDragging(event: TouchEvent) {
    if (event.touches.length === 0) return;

    this.isPlatformRotating = true;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  public stopDragging(event: TouchEvent) {
    if (event.changedTouches.length === 0) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const distanceX = touchEndX - this.touchStartX;
    const distanceY = touchEndY - this.touchStartY;

    // Check if the touch was a tap
    const tapThreshold = 5;
    if (Math.abs(distanceX) < tapThreshold && Math.abs(distanceY) < tapThreshold) {
      this.handleTap();
    }

    // Reset the initial touch position
    this.touchStartX = null;
    this.touchStartY = null;
    this.isPlatformRotating = false;
  }

  private handleTap() {
    const numberOfPieces = config.colors.length;
    const piePieceAngle = (Math.PI * 2) / numberOfPieces;

    this.platforms.obstacles.forEach((segment, index) => {
      const startingAngle = index * piePieceAngle;

      // Rotate to the center of the segment
      const centerAngle = startingAngle + piePieceAngle;
      segment.rotation.y += centerAngle;
    });
  }

  public setEventListners() {
    window.addEventListener('resize', this.handleResize.bind(this));

    // Game events
    document.addEventListener('audio-toggle', this.toggleAudio.bind(this));
    document.addEventListener('pause-game', this.togglePause.bind(this));
    document.addEventListener('reset-game', this.toggleReset.bind(this));
    document.addEventListener('quit-game', this.toggleQuit.bind(this));

    // Disable touch event
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Touch events for mobile devices
    document.addEventListener('touchstart', this.startDragging.bind(this));
    document.addEventListener('touchend', this.stopDragging.bind(this));
  }

  public toggleQuit() {
    document.body.removeChild(this.renderer.domElement);

    if (this.audio) this.audio.stop();
  }

  public toggleReset() {
    if (!this.isGameEnded) return;

    // Reset the game state
    this.isGameEnded = false;
    this.isPaused = false;
    this.mismatchesCount = 0;
    this.gameModeScreen.score = 0;
    this.gameModeScreen.hp = 3;
    this.initialBallFallDelay = config.ballFallDelay;

    this.toggleSceneVisibility();
    this.setGameInterface();
  }

  public setAudio() {
    if (!this.audio) return;

    if (this.isPaused || !Game.audioEnabled) {
      this.audio.stop();
    } else {
      this.audio.play();
    }
  }

  public toggleAudio() {
    this.setAudio();
  }

  public togglePause() {
    this.isPaused = !this.isPaused;

    this.toggleSceneVisibility();

    if (!this.isSceneHidden) {
      this.setGameInterface();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.setAudio();
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

  public addLights() {
    // Add directional light to the scene
    const light = new DirectionalLight(0xffffff, 10);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    // Add ambient light to the scene
    const ambientLight = new AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
  }

  public onGameEnd() {
    const score = new Score();
    score.start({ score: this.gameModeScreen.score });

    this.toggleSceneVisibility();

    this.isPaused = true;
    this.isGameEnded = true;
  }

  public start() {
    this.loadAudio();
    this.setGameInterface();
    this.setEventListners();
    this.setCamera();
    this.setRenderer();

    // Add game objects
    this.addCylinder();
    this.addBall();
    this.addPlatform({ amount: 4 });
    this.addLights();

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
      const increasedSpeed = 0.01 * Math.floor(currentScore / 10); // Increase speed every 10 points
      const totalSpeed = increasedSpeed + this.ballSpeed;
      const increasedFallDelay = 0.01 * Math.floor(currentScore / 10); // Increase delay every 10 points
      this.initialBallFallDelay = this.initialBallFallDelay - increasedFallDelay;

      this.ball.drop(totalSpeed);
      this.ball.handlePlatformCollision({ platforms: this.platforms, scene: this.scene });

      // Check if the ball is intersecting with the platform
      if (this.ball.isIntersected) {
        this.platforms.movePlatforms();
        this.platforms.removeFirstPlatform(this.scene);

        this.addPlatform({ amount: 1 });

        this.ball.changeColor();
        this.ball.reset(); // Reset back to starting postion
        this.ball.isIntersected = false;

        if (this.ball.isMatch) {
          this.gameModeScreen.score += 1;
          this.gameModeScreen.requestUpdate('score', 0);
          this.ball.isMatch = false;
        } else {
          this.gameModeScreen.hp -= 1;
          this.gameModeScreen.requestUpdate('hp', 0);

          this.mismatchesCount += 1;
          if (this.mismatchesCount >= this.mismatchesThreshold) this.onGameEnd();
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}