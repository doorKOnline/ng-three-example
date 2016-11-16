/* Prerequisites */
  /*
   ng serve
   npm install three --save
   npm install @types/three --save -dev
  */
/* Resources */
  /*
   https://github.com/LayZeeDK/ng-three-examples
  */

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-example',
  template: `
    <canvas #canvas (window:resize)="onResize($event)"></canvas>
  `,
  styles: [`
  canvas {
    width: 100%;
    height: 100vh;
    position: absolute;
    margin: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }`]
})
export class ExampleComponent {
  /* HELPER PROPERTIES (PRIVATE PROPERTIES) */
  private camera: THREE.PerspectiveCamera;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas')
  private canvasRef: ElementRef;

  

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;


  /* STAGE PROPERTIES */
  public fieldOfView: number = 70;

  public nearClippingPane: number = 1;

  public farClippingPane: number = 1000;

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }


  /* DEPENDENCY INJECTION (CONSTRUCTOR) */
  constructor() { }



  /* STAGING, ANIMATION, AND RENDERING */
  /**
   * Start the rendering loop
   */
  private startRenderingLoop() {
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas , alpha: true });
    this.renderer.setClearColor( 0x000000, 1 );
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: ExampleComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateGlobe();
      component.animateStars();

      component.renderer.render(component.scene, component.camera);
    }());
  }
  /**
   * Create the scene
   */
  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 300;
  }



  /**
   * Create the globe
   */
  private globe: THREE.Mesh;
  private createGlobe() {
    let texture = new THREE.TextureLoader().load('http://www.nasa.gov/sites/default/files/images/743187main_terra_10th_first_light_map_lrg-full_full.jpg');

    let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
    
    let geometry = new THREE.SphereGeometry(150, 32, 32);

    this.globe = new THREE.Mesh(geometry, material);

    // Add globe to scene
    this.scene.add(this.globe);
  }
  /**
   * Animate the globe
   */
  private animateGlobe() {
    this.globe.rotation.x += 0.0001;
    this.globe.rotation.y += 0.001; 
  }


  /**
   * Create the stars
   */
  private stars: THREE.Mesh;
  private createStars() {
    let texture = new THREE.TextureLoader().load('/assets/tycho8.png');

    let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    
    let geometry = new THREE.SphereGeometry(500, 32, 32);

    this.stars = new THREE.Mesh(geometry, material);

    // Add stars to scene
    this.scene.add(this.stars);
  }
  private animateStars() {
    this.stars.rotation.x += 0.0001;
    this.stars.rotation.y += 0.001; 
  }
  


  /* LIFECYCLE */

  /**
   * We need to wait until template is bound to DOM, as we need the view
   * dimensions to create the scene. We could create the globe in a Init hook,
   * but we would be unable to add it to the scene until now.
   */
  public ngAfterViewInit() {
    this.createScene();
    this.createGlobe();
    this.createStars();
    this.startRenderingLoop();
  }
}

