const { InstancedMesh, InstancedBufferAttribute, Matrix4, Vector3, Vector4 } = THREE;

const zeroMatrix = new Matrix4();
zeroMatrix.makeScale(0, 0, 0);

function DynamicInstancedMesh(geometry, material, maxCount) {
  InstancedMesh.call(this, geometry, material, maxCount);

  this.count = 0;
  this.nextIndex = 0;
  this.matrixAutoUpdate = false;
  this.frustumCulled = false;
  this.freeIndices = new Set();

  const instanceIndices = [];
  for (let i = 0; i < maxCount; i++) {
    instanceIndices.push(i * 1.0);
  }

  this.instanceIndex = new InstancedBufferAttribute(new Float32Array(instanceIndices), 1);
  geometry.setAttribute("instanceIndex", this.instanceIndex);

  this.instanceAttributes = [...(geometry.instanceAttributes || []), ...[[Matrix4, this.instanceMatrix]]];
  this.instanceWriters = [];
  this.instanceFreers = [];

  for (let i = 0; i < this.instanceAttributes.length; i++) {
    const [type, attribute] = this.instanceAttributes[i];

    if (type === Matrix4) {
      this.instanceWriters.push((matrix, index) => {
        matrix.toArray(attribute.array, index * 16);
      });

      this.instanceFreers.push(index => {
        zeroMatrix.toArray(attribute.array, index * 16);
      });
    }

    if (type === Vector3) {
      this.instanceWriters.push((v, index) => {
        attribute.array[index * 3] = v.x;
        attribute.array[index * 3 + 1] = v.y;
        attribute.array[index * 3 + 2] = v.z;
      });

      this.instanceFreers.push(index => {
        attribute.array[index * 3] = 0.0;
        attribute.array[index * 3 + 1] = 0.0;
        attribute.array[index * 3 + 2] = 0.0;
      });
    }

    if (type === Vector4) {
      this.instanceWriters.push((v, index) => {
        attribute.array[index * 4] = v.x;
        attribute.array[index * 4 + 1] = v.y;
        attribute.array[index * 4 + 2] = v.z;
        attribute.array[index * 4 + 3] = v.w;
      });

      this.instanceFreers.push(index => {
        attribute.array[index * 4] = 0.0;
        attribute.array[index * 4 + 1] = 0.0;
        attribute.array[index * 4 + 2] = 0.0;
        attribute.array[index * 4 + 3] = 0.0;
      });
    }

    if (type === Number) {
      this.instanceWriters.push((v, index) => {
        attribute.array[index] = v;
      });

      this.instanceFreers.push(index => {
        attribute.array[index] = 0.0;
      });
    }
  }
}

DynamicInstancedMesh.prototype = Object.assign(Object.create(InstancedMesh.prototype), {
  constructor: DynamicInstancedMesh,

  addInstance() {
    const { nextIndex, freeIndices } = this;
    let index;

    if (freeIndices.size > 0) {
      index = freeIndices.values().next().value;
      freeIndices.delete(index);
    } else {
      index = nextIndex;
      this.count++;
    }

    for (let i = 0; i < arguments.length; i++) {
      this.instanceWriters[i](arguments[i], index);
      this.instanceAttributes[i].needsUpdate = true;
    }

    if (index === nextIndex) {
      this.nextIndex += 1;
    }

    return index;
  },

  freeInstance(index) {
    const { freeIndices } = this;

    for (let i = 0; i < this.instanceFreers.length; i++) {
      this.instanceFreers[i](index);
      this.instanceAttributes[i].needsUpdate = true;
    }

    freeIndices.add(index);
  },

  setColorAt() {
    throw new Error("dynamic color instancing not supported");
  }
});

export { DynamicInstancedMesh };
