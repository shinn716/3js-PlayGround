# LearnThreejs


Play Threejs with typescript.


## Typescript


### Setup Env.
1. `npm init`
2. `npm install three --save-dev`
3. `npm install @types/three --save-dev`
4. `npm install webpack webpack-cli webpack-dev-server webpack-merge ts-loader --save-dev`
5. `npm install typescript --save-dev`


建立 index.html
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Three.js TypeScript Tutorials by Sean Bradley : https://sbcode.net/threejs</title>
        <style>
            body {
                overflow: hidden;
                margin: 0px;
            }
        </style>
    </head>

    <body>
        <script type="module" src="bundle.js"></script>
    </body>
</html>
```


複製 tsconfig.json 至 client 資料夾
```
{
    "compilerOptions": {
        "moduleResolution": "node",
        "strict": true
    },
    "include": ["**/*.ts"]
}
```


複製 webpack.common.js 至 client 資料夾
```
const path = require('path')

module.exports = {
    entry: './src/client/client.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
}
```


複製 webpack.dev.js 至 client 資料夾
```
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, '../../dist/client'),
        },
        hot: true,
    },
})
```


修改 Package.json 內容:
``` 
{
    "name": "three.js-typescript-tutorial",
    "version": "1.0.0",
    "description": "",
    "scripts": {
        "dev": "webpack serve --config ./src/client/webpack.dev.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {},
    "devDependencies": {
        "@types/three": "^0.149.0",
        "three": "^0.149.0",
        "ts-loader": "^9.4.2",
        "typescript": "^4.9.5",
        "webpack": "^5.75.0",
        "webpack-cli": "^5.0.1",
        "webpack-dev-server": "^4.11.1",
        "webpack-merge": "^5.8.0"
    }
}
```

client.ts
```
import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
```


template 檔案結構
```
|-- Three.js-TypeScript-Tutorial
    |-- dist
        |-- client
            |-- index.html
        |-- server
    |-- node_modules
        |-- @types
            |-- three
                |-- (Several extra files and folders containing the Three.js definitions)
        |-- three
            |-- (Several extra files and folders containing the Three.js source code)
    |-- src
        |-- client
            |-- client.ts
            |-- tsconfig.json
            |-- webpack.common.js
            |-- webpack.dev.js
        |-- server
    |-- package.json
    |-- package-lock.json
```


### Debug
npm run dev


### Add webpack
1. `npm install webpack webpack-cli --save-dev` -->import webpack & webpack-cli
2. `npm install webpack-dev-server --save-dev` -->import dev server for local test server
3. `npm install html-webpack-plugin --save-dev` -->import html-webpack-plugin for local test webpage
4. Build `npx webpack`


### Ref.
https://sbcode.net/threejs/webpack-dev-server/
