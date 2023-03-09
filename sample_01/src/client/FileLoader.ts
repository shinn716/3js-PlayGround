import THREE = require("three");

export default class FileLoader {

    constructor(){

        console.log('Loader Json-----');
		var loader = new THREE.FileLoader();
		loader.load("others/scene.json", (text) => {
			// console.log(text);
			const obj = JSON.parse(text as string);
			console.log(obj.name);
            console.log(obj.sections.main.type);
		});
    }

}