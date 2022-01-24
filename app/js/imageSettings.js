const FILE_NAME = 'imageSetting';
const FILE_TYPE = 'application/json';

/**
 * Method to download a file
 * @param {*} content 
 * @param {*} fileName 
 * @param {*} contentType 
 */
function downloadFile(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

/**
 * Export image settings in json
 * @param {*} imageDimensions 
 * @param {*} options 
 */
export function exportSettings({ height, width }, options) {
  const { scale, topPos, leftPos } = options;
  const jsonData = {
    canvas : {
      width,
      height,
      photo : {
        id: FILE_NAME,
        width: width * scale,
        height: height * scale,
        x: leftPos,
        y: topPos
      }
    }
  };
  downloadFile(JSON.stringify(jsonData), `${FILE_NAME}.json`, FILE_TYPE);
}

/**
 * Get image settings from json file
 * @param {*} files 
 */
export async function getImageSettings(files) {
  return new Promise(resolve => {
    if (files.length) {
      const file = files[0];
      if (file.type === FILE_TYPE) {
        let reader = new FileReader(); 
        reader.readAsText(file);
  
        reader.onload = function() {
          try {
            resolve(JSON.parse(reader.result));
          } catch(err) {
            console.error("Unable to parse json!", err);
          }
        };
      
        reader.onerror = function() {
          console.log('onerror'. reader.error);
        };
      }
    }
  });
}