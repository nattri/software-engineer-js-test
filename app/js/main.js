import '../css/main.scss';
import { renderCanvasImage } from './imageOperations';
import { exportSettings, getImageSettings } from './imageSettings';

const AppView = () => {
	// grab DOM elements inside index.html
	const fileSelector = document.getElementById("fileSelector");
	const editorCanvas = document.getElementById("editorCanvas");
	const scaleToDouble = document.getElementById('scaleToDouble');
	const scaleToHalf = document.getElementById('scaleToHalf');
	const moveToLeft = document.getElementById('moveToLeft');
	const moveToRight = document.getElementById('moveToRight');
	const moveToTop = document.getElementById('moveToTop');
	const moveToBottom = document.getElementById('moveToBottom');
	const resetImage = document.getElementById('resetImage');
	const form = document.getElementById('form');
	const importSettings = document.getElementById('importSettings');

	fileSelector.onchange = function( e ) {
		// get all selected Files
		const files = e.target.files;
		let file;
		for ( let i = 0; i < files.length; ++i ) {
			file = files[ i ];
			// check if file is valid Image (just a MIME check)
			switch ( file.type ) {
				case "image/jpeg":
				case "image/png":
				case "image/gif":
					// read Image contents from file
					const reader = new FileReader();
					reader.onload = function( e ) {
						// create HTMLImageElement holding image data
						const img = new Image();
						img.src = reader.result;

						// Image setting
						let scale, leftPos, topPos;

						function resetImageSettings() {
							scale = 1;
							leftPos = 0;
							topPos = 0;
						}
						resetImageSettings();

						img.onload = function() {
							// grab some data from the image
							const width = img.naturalWidth;
							const height = img.naturalHeight;
							editorCanvas.width = 500;
							editorCanvas.height = 500 * height / width;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}
						// Binding methods for image operations
						scaleToDouble.onclick = function(e) {
							scale *= 2;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						scaleToHalf.onclick = function(e) {
							scale *= 0.5;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						moveToLeft.onclick = function(e) {
							leftPos -= 10;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						moveToRight.onclick = function(e) {
							leftPos += 10;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						moveToTop.onclick = function(e) {
							topPos -= 10;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						moveToBottom.onclick = function(e) {
							topPos += 10;
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						resetImage.onclick = function(e) {
							resetImageSettings();
							renderCanvasImage(img, editorCanvas, { scale, leftPos, topPos });
						}

						// Image settings methods
						form.onsubmit = function(e) {
							exportSettings(
								{ height: img.naturalHeight, width: img.naturalWidth }, 
								{ scale, leftPos, topPos }
							);
						}

						// Enable import json and attach event
						importSettings.disabled = false;
						importSettings.onchange = async function(e) {
							try {
								const {
									canvas: {
										width: imageWidth,
										photo: {
											width, x, y
										}
									}
								} = await getImageSettings(e.target.files);
								const newScale = width / imageWidth;
								renderCanvasImage(img, editorCanvas, { scale: newScale, leftPos: x, topPos: y });
							} catch(err) {
								console.error('Unable to import json', err);
							}
						}
					};
					reader.readAsDataURL( file );
					// process just one file.
					return;
			}
		}
	};
}

AppView();

