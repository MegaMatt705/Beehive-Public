
 // Sample post data for demonstration
export const posts = []

// Fetch the filenames of the images
let gfsReady = false;

function checkGfsStatus() {
  fetch('http://localhost:3001/gfs-status')
    .then(response => response.json())
    .then(data => {
      // console.log("GFS status:", data)
      if (data.status === 'ready') {
        gfsReady = true;
        fetchImages();
      } else {
        setTimeout(checkGfsStatus, 1000);  // check again after 1 second
      }
    });
}

function fetchImages() {
  fetch('http://localhost:3001/get-image-filenames')
    .then(response => response.json())
    .then(data => {
      console.log('data for filenames:', data);
      // For each filename, create a URL for the image
      data.images.forEach(filename => {
        const imageUrl = `http://localhost:3001/image/${filename}`; // URL for the image
        posts.push({
          id: posts.length + 1,
          imageUrl,
        });
      });
    })
    .catch(error => console.error('Error fetching image filenames:', error.message));
}

checkGfsStatus();