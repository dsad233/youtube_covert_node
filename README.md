# Youtube convert Node.js

</br>

**Package manager**
- npm

</br>

**Package list**
- express
- youtube-dl-exec
- path
- fs
- dotenv
- exec (child_process) = ffmpeg
- cors

</br>

**Install**
- npm
  <pre>
  <code>
  npm install express youtube-dl-exec path fs dotenv 
  </code>
  </pre>
  
- brew
  <pre>
  <code>
  brew install ffmpeg
  </code>
  </pre>


</br>


**Default Setting**
- .env
  <pre>
  <code>
  DOWNLOAD_PATH = "Your download path result"
  </code>
  </pre>


</br>


**How to run?**
- terminal
  <pre>
  <code>
  node main.js
  </code>
  </pre>
- url
  <pre>
  <code>
  - MP3 download
  http://localhost:3000/mp3/download?youtubeUrl="download youtube url"
  </br>
  - MP4 download
  http://localhost:3000/mp4/download?youtubeUrl="download youtube url"
  </code>
  </pre>




