namespace Render {
	export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const gl = canvas.getContext("webgl2");

	let pointsCount: number;

	let buffers: any;

	let texture: WebGLTexture;

	function createFrontFace(x: number, y: number, z: number) {
		return [
			x, y, z + 1,
			x + 1, y, z + 1,
			x + 1, y + 1, z + 1,
			x, y + 1, z + 1
		];
	}

	function createBackFace(x: number, y: number, z: number) {
		return [
			x, y, z,
			x, y + 1, z,
			x + 1, y + 1, z,
			x + 1, y, z
		];
	}

	function createTopFace(x: number, y: number, z: number) {
		return [
			x, y + 1, z,
			x + 1, y + 1, z,
			x + 1, y + 1, z + 1,
			x, y + 1, z + 1
		];
	}

	function createBottomFace(x: number, y: number, z: number) {
		return [
			x, y, z,
			x + 1, y, z,
			x + 1, y, z + 1,
			x, y, z + 1
		];
	}

	function createRightFace(x: number, y: number, z: number) {
		return [
			x + 1, y, z,
			x + 1, y + 1, z,
			x + 1, y + 1, z + 1,
			x + 1, y, z + 1
		];
	}

	function createLeftFace(x: number, y: number, z: number) {
		return [
			x, y, z,
			x, y, z + 1,
			x, y + 1, z + 1,
			x, y + 1, z
		];
	}

	function createFaceColor(color: number) {

		return [color, color, color, color];
	}

	function createFrontTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createBackTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createTopTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createBottomTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createRightTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createLeftTexture() {
		return [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
	}

	function createIndices(i: number) {
		return [
			i + 0, i + 1, i + 2, i + 0, i + 2, i + 3
		];
	}

	function initBuffers() {
		let positions: number[] = [];
		let colors: number[] = [];
		let textures: number[] = [];
		let indices: number[] = [];

		let index = 0;

		pointsCount = 0;

		for (let z = World.SIZE - 1; z >= 0; z--) {
			for (let y = World.HEIGHT - 1; y >= 0; y--) {
				for (let x = World.SIZE - 1; x >= 0; x--) {
					if (World.get(x, y, z) !== 0) {
						if (World.get(x + 1, y, z) === 0) {
							positions.push(...createRightFace(x, y, z));
							colors.push(...createFaceColor(0.8));
							textures.push(...createRightTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}

						if (World.get(x - 1, y, z) === 0) {
							positions.push(...createLeftFace(x, y, z));
							colors.push(...createFaceColor(0.8));
							textures.push(...createLeftTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}

						if (World.get(x, y + 1, z) === 0) {
							positions.push(...createTopFace(x, y, z));
							colors.push(...createFaceColor(0.9));
							textures.push(...createTopTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}

						if (World.get(x, y - 1, z) === 0) {
							positions.push(...createBottomFace(x, y, z));
							colors.push(...createFaceColor(0.6));
							textures.push(...createBottomTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}

						if (World.get(x, y, z + 1) === 0) {
							positions.push(...createFrontFace(x, y, z));
							colors.push(...createFaceColor(0.7));
							textures.push(...createFrontTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}

						if (World.get(x, y, z - 1) === 0) {
							positions.push(...createBackFace(x, y, z));
							colors.push(...createFaceColor(0.7));
							textures.push(...createBackTexture());
							indices.push(...createIndices(index));

							index += 4;
							pointsCount += 6;
						}
					}
				}
			}
		}

		console.log(positions.length);
		console.log(colors.length);
		console.log(textures.length);
		console.log(indices.length);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

		const textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		return {
			position: positionBuffer,
			color: colorBuffer,
			texture: textureBuffer,
			indices: indexBuffer,
		};
	}

	function loadTexture(url: string) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([255, 0, 255, 255]);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			width, height, border, srcFormat, srcType,
			pixel);

		const image = new Image();
		image.onload = function () {
			gl.bindTexture(gl.TEXTURE_2D, texture);

			const texSize = 128;

			let canvas = document.createElement("canvas");
			canvas.height = texSize;
			canvas.width = texSize;

			let gc = canvas.getContext("2d");
			gc.imageSmoothingEnabled = false;

			gc.drawImage(image, 0, 0, texSize, texSize);

			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				srcFormat, srcType, canvas);

			gl.generateMipmap(gl.TEXTURE_2D);
		};
		image.src = url;

		return texture;
	}

	// Vertex shader program
	const vsSource = `
        attribute vec4 aVertexPosition;
        attribute float aVertexColor;
        attribute vec2 aVertexTexture;

        uniform mat4 uViewMatrix;
        uniform vec3 uPlayerPos;

        varying lowp float vColor;
        varying lowp vec2 vTexture;

        void main() {
            gl_Position = uViewMatrix * aVertexPosition;
    
            vColor = aVertexColor;
            vTexture = aVertexTexture;
        }`;

	// Fragment shader program
	const fsSource = `
        varying lowp float vColor;
        varying lowp vec2 vTexture;

        uniform sampler2D uSampler;

        void main() {
            lowp vec4 color = texture2D(uSampler, vTexture);
            color.rgb *= vColor;

            gl_FragColor = color;
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
			vertexTexture: gl.getAttribLocation(shaderProgram, 'aVertexTexture')
		},

		uniformLocations: {
			uViewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
			uPlayerPos: gl.getUniformLocation(shaderProgram, 'uPlayerPos')
		},
	};


	export function prepare() {
		// Only continue if WebGL is available and working
		if (gl === null) {
			alert("Unable to initialize WebGL. Your browser don't support it.");
			return;
		}

		buffers = initBuffers();

		texture = loadTexture("grass.png");

		// Set the program to use
		gl.useProgram(programInfo.program);

		gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
		gl.clearDepth(1.0); // Clear everything
		gl.enable(gl.DEPTH_TEST); // Enable depth testing
		gl.depthFunc(gl.LEQUAL); // Near things obscure far things
	}

	export function drawScene() {
		if (canvas.height !== window.innerHeight || canvas.width !== window.innerWidth) {
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

		// Clear the canvas and depth buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Use texture unit 0
		gl.activeTexture(gl.TEXTURE0);

		// Link texture to texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Use texture unit 0 with the shader
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

		{
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
			mat4.rotateY(modelViewMatrix, modelViewMatrix, Player.rotY);

			mat4.translate(modelViewMatrix, modelViewMatrix, -Player.x, -Player.y, -Player.z);

			const viewMatrix = mat4.create();

			mat4.multiply(viewMatrix, projectionMatrix, modelViewMatrix);

			// Set view matrix uniform
			gl.uniformMatrix4fv(
				programInfo.uniformLocations.uViewMatrix,
				false,
				viewMatrix);

			gl.uniform3fv(
				programInfo.uniformLocations.uPlayerPos,
				[Player.x, Player.y, Player.z]
			)
		}

		// How to read color buffer
		{
			const numComponents = 1; // Values pulled per iteration
			const type = gl.FLOAT;   // Data type
			const normalize = false; // Don't normalize
			const stride = 0;        // Bytes to skip between iterations
			const offset = 0;        // Bytes to skip before first iteration
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
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
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
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

		// How to read texture buffer
		{
			const num = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
			gl.vertexAttribPointer(programInfo.attribLocations.vertexTexture, num, type, normalize, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexTexture);
		}

		{
			const vertexCount = pointsCount;
			const type = gl.UNSIGNED_INT;
			const offset = 0;

			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}
	}
}