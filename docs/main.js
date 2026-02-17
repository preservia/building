const canvas = document.getElementById('bg');
const gl = canvas.getContext('webgl');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
window.addEventListener('resize', resize);
resize();

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 resolution;
uniform float time;

float blob(vec2 uv, vec2 pos, float radius) {
  float d = length(uv - pos);
  return radius / d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;

  float t = time * 0.2;

  float field = 0.0;

  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 pos = vec2(
      0.5 + 0.3 * sin(t + fi),
      0.5 + 0.3 * cos(t * 1.2 + fi)
    );
    field += blob(uv, pos, 0.08);
  }

  float intensity = smoothstep(0.9, 1.5, field);
  float glow = pow(intensity, 3.0);

  vec3 color = vec3(0.0, glow * 0.8, glow * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const position = gl.getAttribLocation(program, 'position');
const resolution = gl.getUniformLocation(program, 'resolution');
const time = gl.getUniformLocation(program, 'time');

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

function render(t) {
  gl.uniform2f(resolution, canvas.width, canvas.height);
  gl.uniform1f(time, t * 0.001);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

async function fetchLatestVersion() {
  const button = document.getElementById("download");

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/preservia/firmware/refs/heads/main/info/latest.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data.version) {
      throw new Error("Version field missing");
    }

    button.textContent = `Download • ${data.version}`;

    button.dataset.version = data.version;

  } catch (error) {
    console.error("Version fetch failed:", error);
    button.textContent = "Download • Unavailable";
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
  }
}

fetchLatestVersion();
