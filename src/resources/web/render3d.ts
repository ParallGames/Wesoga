namespace Render3D {
	export const canvas = document.getElementById("canvas3d") as HTMLCanvasElement;
	const gl = canvas.getContext("webgl2", { alpha: false });

	const worldPositionBuffer = gl.createBuffer();
	const worldColorBuffer = gl.createBuffer();
	const worldTexturePosBuffer = gl.createBuffer();
	const worldTextureIDBuffer = gl.createBuffer();
	const worldIndexBuffer = gl.createBuffer();
	let worldIndexBufferLength = 0;

	const entityPositionBuffer = gl.createBuffer();
	const entityColorBuffer = gl.createBuffer();
	const entityTexturePosBuffer = gl.createBuffer();
	const entityTextureIDBuffer = gl.createBuffer();
	const entityIndexBuffer = gl.createBuffer();
	let entityIndexBufferLength = 0;

	function createNorthFace(x: number, y: number, z: number) {
		return [
			x + 1, y, z,
			x, y, z,
			x, y + 1, z,
			x + 1, y + 1, z
		];
	}

	function createSouthFace(x: number, y: number, z: number) {
		return [
			x, y, z + 1,
			x + 1, y, z + 1,
			x + 1, y + 1, z + 1,
			x, y + 1, z + 1
		];
	}

	function createTopFace(x: number, y: number, z: number) {
		return [
			x, y + 1, z + 1,
			x + 1, y + 1, z + 1,
			x + 1, y + 1, z,
			x, y + 1, z
		];
	}

	function createBottomFace(x: number, y: number, z: number) {
		return [
			x + 1, y, z + 1,
			x, y, z + 1,
			x, y, z,
			x + 1, y, z
		];
	}

	function createEastFace(x: number, y: number, z: number) {
		return [
			x + 1, y, z + 1,
			x + 1, y, z,
			x + 1, y + 1, z,
			x + 1, y + 1, z + 1
		];
	}

	function createWestFace(x: number, y: number, z: number) {
		return [
			x, y, z,
			x, y, z + 1,
			x, y + 1, z + 1,
			x, y + 1, z
		];
	}

	function createPlayerFrontFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmax, ymin, zmin);
		let r2 = mat4.multiplyVector(mat, xmin, ymin, zmin);
		let r3 = mat4.multiplyVector(mat, xmin, ymax, zmin);
		let r4 = mat4.multiplyVector(mat, xmax, ymax, zmin);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createPlayerBackFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmin, ymin, zmax);
		let r2 = mat4.multiplyVector(mat, xmax, ymin, zmax);
		let r3 = mat4.multiplyVector(mat, xmax, ymax, zmax);
		let r4 = mat4.multiplyVector(mat, xmin, ymax, zmax);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createPlayerTopFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmin, ymax, zmax);
		let r2 = mat4.multiplyVector(mat, xmax, ymax, zmax);
		let r3 = mat4.multiplyVector(mat, xmax, ymax, zmin);
		let r4 = mat4.multiplyVector(mat, xmin, ymax, zmin);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createPlayerBottomFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmax, ymin, zmax);
		let r2 = mat4.multiplyVector(mat, xmin, ymin, zmax);
		let r3 = mat4.multiplyVector(mat, xmin, ymin, zmin);
		let r4 = mat4.multiplyVector(mat, xmax, ymin, zmin);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createPlayerRightFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmax, ymin, zmax);
		let r2 = mat4.multiplyVector(mat, xmax, ymin, zmin);
		let r3 = mat4.multiplyVector(mat, xmax, ymax, zmin);
		let r4 = mat4.multiplyVector(mat, xmax, ymax, zmax);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createPlayerLeftFace(x: number, y: number, z: number, size: number, height: number, mat: Float32Array) {
		let xmin = -size / 2;
		let xmax = size / 2;

		let ymin = -height / 2;
		let ymax = height / 2;

		let zmin = -size / 2;
		let zmax = size / 2;

		let r1 = mat4.multiplyVector(mat, xmin, ymin, zmin);
		let r2 = mat4.multiplyVector(mat, xmin, ymin, zmax);
		let r3 = mat4.multiplyVector(mat, xmin, ymax, zmax);
		let r4 = mat4.multiplyVector(mat, xmin, ymax, zmin);

		return [
			x + r1.x + xmax, y + r1.y + ymax, z + r1.z + zmax,
			x + r2.x + xmax, y + r2.y + ymax, z + r2.z + zmax,
			x + r3.x + xmax, y + r3.y + ymax, z + r3.z + zmax,
			x + r4.x + xmax, y + r4.y + ymax, z + r4.z + zmax
		];
	}

	function createFaceColor(color: number) {
		return [color, color, color, color];
	}

	function createTexturePos() {
		return [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0];
	}

	function createTextureID(id: number) {
		return [id, id, id, id];
	}

	function createIndices(i: number) {
		return [i + 0, i + 1, i + 2, i + 0, i + 2, i + 3];
	}

	function initWorldBuffers() {
		let positions: number[] = [];
		let colors: number[] = [];
		let texturesPos: number[] = [];
		let texturesID: number[] = [];
		let indices: number[] = [];

		let index = 0;

		worldIndexBufferLength = 0;

		for (let z = World.SIZE - 1; z >= 0; z--) {
			for (let y = World.HEIGHT - 1; y >= 0; y--) {
				for (let x = World.SIZE - 1; x >= 0; x--) {
					let model = BlockModels.get(World.get(x, y, z));

					if (model.visible) {
						if (x + 1 < World.SIZE && !(BlockModels.get(World.get(x + 1, y, z)).visible)) {
							positions.push(...createEastFace(x, y, z));
							colors.push(...createFaceColor(0.8));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.eastTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}

						if (x > 0 && !(BlockModels.get(World.get(x - 1, y, z)).visible)) {
							positions.push(...createWestFace(x, y, z));
							colors.push(...createFaceColor(0.8));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.westTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}

						if (y + 1 < World.HEIGHT && !(BlockModels.get(World.get(x, y + 1, z)).visible)) {
							positions.push(...createTopFace(x, y, z));
							colors.push(...createFaceColor(0.9));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.topTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}

						if (y > 0 && !(BlockModels.get(World.get(x, y - 1, z)).visible)) {
							positions.push(...createBottomFace(x, y, z));
							colors.push(...createFaceColor(0.6));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.botTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}

						if (z + 1 < World.SIZE && !(BlockModels.get(World.get(x, y, z + 1)).visible)) {
							positions.push(...createSouthFace(x, y, z));
							colors.push(...createFaceColor(0.7));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.northTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}

						if (z > 0 && !(BlockModels.get(World.get(x, y, z - 1)).visible)) {
							positions.push(...createNorthFace(x, y, z));
							colors.push(...createFaceColor(0.7));
							texturesPos.push(...createTexturePos());
							texturesID.push(...createTextureID(model.southTexture));
							indices.push(...createIndices(index));

							index += 4;
							worldIndexBufferLength += 6;
						}
					}
				}
			}
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, worldPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, worldColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, worldTexturePosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturesPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, worldTextureIDBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(texturesID), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
	}

	function loadTexture() {
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, gl.createTexture());

		gl.texImage3D(
			gl.TEXTURE_2D_ARRAY,
			0,
			gl.RGBA,
			Textures.textureSize,
			Textures.textureSize,
			Textures.textureCount,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			Textures.textures
		);

		let ext = gl.getExtension('EXT_texture_filter_anisotropic')
		gl.texParameterf(gl.TEXTURE_2D_ARRAY, ext.TEXTURE_MAX_ANISOTROPY_EXT, gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT));

		gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		gl.activeTexture(gl.TEXTURE0);
	}

	// Vertex shader program
	const vsSource =
		`#version 300 es

		in highp vec4 aVertexPosition;
		in lowp float aVertexColor;
		in lowp vec2 aVertexTexturePos;
		in lowp uint aVertexTextureID;

		uniform highp mat4 uViewMatrix;

		out lowp float vColor;
		out lowp vec2 vTexturePos;
		flat out lowp uint vTextureID;

		void main() {
			gl_Position = uViewMatrix * aVertexPosition;

			vColor = aVertexColor;
			vTexturePos = aVertexTexturePos;
			vTextureID = aVertexTextureID;
		}`;

	// Fragment shader program
	const fsSource =
		`#version 300 es

		in lowp float vColor;
		
		in lowp vec2 vTexturePos;
		flat in lowp uint vTextureID;

		uniform lowp sampler2DArray uSampler;

		out lowp vec4 fragColor;

		void main() {
			lowp vec4 color = texture(uSampler, vec3(vTexturePos, vTextureID));
			color.rgb *= vColor;

			fragColor = color;
		}`;

    /**
   * Compile the given shader with the given type
   */
	function loadShader(type: number, source: string) {
		const shader = gl.createShader(type);

		// Send the source to the shader object
		gl.shaderSource(shader, source);

		// Compile the shader program
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(shader));
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	function initShaderProgram(vsSource: string, fsSource: string) {
		const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
		const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

		// Create the shader program
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		return shaderProgram;
	}

	const shaderProgram = initShaderProgram(vsSource, fsSource);

	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			vertexTexturePos: gl.getAttribLocation(shaderProgram, 'aVertexTexturePos'),
			vertexTextureID: gl.getAttribLocation(shaderProgram, 'aVertexTextureID')
		},

		uniformLocations: {
			uViewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
		},
	};


	export function prepare() {
		// Only continue if WebGL is available and working
		if (gl === null) {
			alert("Unable to initialize WebGL. Your browser don't support it.");
			return;
		}

		loadTexture();
		initWorldBuffers();

		// Set the program to use
		gl.useProgram(programInfo.program);

		gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
		gl.clearDepth(1.0); // Clear everything
		gl.enable(gl.DEPTH_TEST); // Enable depth testing
		gl.depthFunc(gl.LESS); // Near things obscure far things

		gl.enable(gl.CULL_FACE); // Enable face culling
		gl.cullFace(gl.BACK); // Don't show back face
		gl.frontFace(gl.CCW); // Front face of triangles are in counter clockwise order
	}

	function setCommonBuffers() {
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

		const fieldOfView = 45 * Math.PI / 180;
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 1000.0;
		const projectionMatrix = mat4.create();

		mat4.perspective(projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar);

		const modelViewMatrix = mat4.create();

		mat4.rotateX(modelViewMatrix, modelViewMatrix, Player.rotX);
		mat4.rotateY(modelViewMatrix, modelViewMatrix, -Player.rotY);

		mat4.translate(modelViewMatrix, modelViewMatrix, -(Player.aX + 0.3906), -(Player.aY + 1.5), -(Player.aZ + 0.3906));

		const viewMatrix = mat4.create();

		mat4.multiply(viewMatrix, projectionMatrix, modelViewMatrix);

		// Set view matrix uniform
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.uViewMatrix,
			false,
			viewMatrix);
	}

	function drawWorld() {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldIndexBuffer);

		// How to read color buffer
		{
			const numComponents = 1; // Values pulled per iteration
			const type = gl.FLOAT;   // Data type
			const normalize = false; // Don't normalize
			const stride = 0;        // Bytes to skip between iterations
			const offset = 0;        // Bytes to skip before first iteration
			gl.bindBuffer(gl.ARRAY_BUFFER, worldColorBuffer);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexColor,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexColor);
		}

		// How to read position buffer
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, worldPositionBuffer);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		// How to read texturePos buffer
		{
			const num = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, worldTexturePosBuffer);
			gl.vertexAttribPointer(programInfo.attribLocations.vertexTexturePos, num, type, normalize, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexTexturePos);
		}

		// How to read textureID buffer
		{
			const num = 1;
			const type = gl.UNSIGNED_BYTE;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, worldTextureIDBuffer);
			gl.vertexAttribIPointer(programInfo.attribLocations.vertexTextureID, num, type, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexTextureID);
		}

		{
			const vertexCount = worldIndexBufferLength;
			const type = gl.UNSIGNED_INT;
			const offset = 0;

			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}
	}

	function drawEntities() {
		let positions: number[] = [];
		let colors: number[] = [];
		let texturesPos: number[] = [];
		let texturesID: number[] = [];
		let indices: number[] = [];

		let index = 0;

		let entities = World.entities;

		entityIndexBufferLength = 0;

		for (let i = 0; i < entities.length; i++) {

			let entity = entities[i];

			let mat = mat4.create();
			mat4.rotateY(mat, mat, entity.rot);

			let model = EntityModels.get(entity.model);

			let x = entity.aX;
			let y = entity.aY;
			let z = entity.aZ;

			positions.push(...createPlayerRightFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.8));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.eastTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;

			positions.push(...createPlayerLeftFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.8));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.westTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;

			positions.push(...createPlayerTopFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.9));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.topTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;

			positions.push(...createPlayerBottomFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.6));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.botTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;

			positions.push(...createPlayerFrontFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.7));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.northTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;

			positions.push(...createPlayerBackFace(x, y, z, model.size, model.height, mat));
			colors.push(...createFaceColor(0.7));
			texturesPos.push(...createTexturePos());
			texturesID.push(...createTextureID(model.southTexture));
			indices.push(...createIndices(index));

			index += 4;
			entityIndexBufferLength += 6;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, entityPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, entityColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, entityTexturePosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturesPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, entityTextureIDBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(texturesID), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entityIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		// How to read color buffer
		{
			const numComponents = 1; // Values pulled per iteration
			const type = gl.FLOAT;   // Data type
			const normalize = false; // Don't normalize
			const stride = 0;        // Bytes to skip between iterations
			const offset = 0;        // Bytes to skip before first iteration
			gl.bindBuffer(gl.ARRAY_BUFFER, entityColorBuffer);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexColor,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexColor);
		}

		// How to read position buffer
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, entityPositionBuffer);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		// How to read texturePos buffer
		{
			const num = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, entityTexturePosBuffer);
			gl.vertexAttribPointer(programInfo.attribLocations.vertexTexturePos, num, type, normalize, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexTexturePos);
		}

		// How to read textureID buffer
		{
			const num = 1;
			const type = gl.UNSIGNED_BYTE;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, entityTextureIDBuffer);
			gl.vertexAttribIPointer(programInfo.attribLocations.vertexTextureID, num, type, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexTextureID);
		}

		{
			const vertexCount = entityIndexBufferLength;
			const type = gl.UNSIGNED_INT;
			const offset = 0;

			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}
	}

	export function render() {
		if (canvas.height !== window.innerHeight || canvas.width !== window.innerWidth) {
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		setCommonBuffers();

		drawWorld();

		drawEntities();
	}
}
