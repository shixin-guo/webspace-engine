import { SHAPE, FIT } from "three-ammo/constants";
import { almostEqualVec3 } from "../utils/three-utils";

AFRAME.registerComponent("shape-helper", {
  schema: {
    type: {
      default: SHAPE.HULL,
      oneOf: [
        SHAPE.BOX,
        SHAPE.CYLINDER,
        SHAPE.SPHERE,
        SHAPE.CAPSULE,
        SHAPE.CONE,
        SHAPE.HULL,
        SHAPE.HACD,
        SHAPE.VHACD,
        SHAPE.MESH,
        SHAPE.HEIGHTFIELD
      ]
    },
    fit: { default: FIT.ALL, oneOf: [FIT.ALL, FIT.MANUAL] },
    halfExtents: { type: "vec3", default: { x: 1, y: 1, z: 1 } },
    minHalfExtent: { default: 0 },
    maxHalfExtent: { default: Number.POSITIVE_INFINITY },
    sphereRadius: { default: NaN },
    cylinderAxis: { default: "y", oneOf: ["x", "y", "z"] },
    margin: { default: 0.01 },
    offset: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
    orientation: { type: "vec4", default: { x: 0, y: 0, z: 0, w: 1 } },
    heightfieldData: { default: [] },
    heightfieldDistance: { default: 1 },
    includeInvisible: { default: false }
  },

  multiple: true,

  init: function() {
    this.system = this.el.sceneEl.systems["hubs-systems"].physicsSystem;
    this.alive = true;
    this.uuid = -1;
    this.system.registerShapeHelper(this);
  },

  init2: function() {
    this.lastScale = new THREE.Vector3(1, 1, 1);
    this.mesh = null;

    let bodyEl = this.el;
    this.bodyHelper = bodyEl.components["body-helper"] || null;
    while (!this.bodyHelper && bodyEl.parentNode != this.el.sceneEl) {
      bodyEl = bodyEl.parentNode;
      if (bodyEl.components["body-helper"]) {
        this.bodyHelper = bodyEl.components["body-helper"];
      }
    }
    if (!this.bodyHelper || this.bodyHelper.uuid === null || this.bodyHelper.uuid === undefined) {
      console.warn("body not found");
      return;
    }
    if (this.data.fit === FIT.ALL) {
      if (!this.el.object3DMap.mesh) {
        console.error("Cannot use FIT.ALL without object3DMap.mesh");
        return;
      }
      this.mesh = this.el.object3DMap.mesh;
      this.mesh.updateMatrices();
    }

    this.uuid = this.system.addShapes(this.bodyHelper.uuid, this.mesh, this.data);

    this.shapeReady = false;

    // Huge HACK, need to do this properly later to deal with any race conditions
    // on scale being set somewhere else and shape not being ready to be fixed
    // up yet.
    setTimeout(() => (this.shapeReady = true), 500);
  },

  tick: function() {
    if (!this.shapeReady) return;
    if (!this.mesh || !this.uuid) return;
    if (almostEqualVec3(this.mesh.scale, this.lastScale)) return;
    this.system.updateShapesScale(this.uuid, this.mesh, this.data);
    this.lastScale.copy(this.mesh.scale);
  },

  remove: function() {
    if (this.uuid !== -1) {
      this.system.removeShapes(this.bodyHelper.uuid, this.uuid);
    }
    this.alive = false;
  }
});
