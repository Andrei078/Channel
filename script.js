// datele tale de la Google Cloud Console
const CLIENT_ID = "367641338219-ng2g583rt2ehfouh6qq0sh60qo6mm3al.apps.googleusercontent.com";
const API_KEY = "AIzaSyDoRAYTU4nqOhUcHjCRsMx23DkH82kAhf8"; 
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";
const CHANNEL_ID = "UCITHC5fLQJy8ufLyd78D7SA";

// inițializare API
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
    scope: SCOPES
  }).then(() => {
    // creează buton login dacă nu este logat
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      const authBtn = document.createElement("button");
      authBtn.innerText = "Conectează-te cu Google";
      authBtn.onclick = handleAuthClick;
      document.body.prepend(authBtn);
    } else {
      loadChannelData();
      loadLatestVideo();
      loadComments();
    }
  });
}

// încărcare librărie
gapi.load("client:auth2", initClient);

// login
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    document.querySelector("button").style.display = "none"; // ascunde butonul
    loadChannelData();
    loadLatestVideo();
    loadComments();
  });
}

// preluare info canal (abonati + avatar)
async function loadChannelData() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const channel = data.items[0];

  document.getElementById("subs").innerText = channel.statistics.subscriberCount + " abonați";
  document.getElementById("avatar").src = channel.snippet.thumbnails.high.url;
}

// preluare ultimul videoclip
async function loadLatestVideo() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1`;
  const res = await fetch(url);
  const data = await res.json();
  const video = data.items.find(item => item.id.videoId);
  const videoId = video ? video.id.videoId : null;


  document.getElementById("latestVideo").innerHTML =
    `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

// preluare ultimele 5 comentarii
async function loadComments() {
  const response = await gapi.client.youtube.commentThreads.list({
    part: "snippet",
    maxResults: 5,
    allThreadsRelatedToChannelId: CHANNEL_ID,
    order: "time"
  });

  const box = document.getElementById("commentsBox");
  box.innerHTML = "<h3>Ultimele comentarii</h3>";

  response.result.items.forEach(item => {
    const snippet = item.snippet.topLevelComment.snippet;
    const author = snippet.authorDisplayName;
    const text = snippet.textDisplay;
    const publishedAt = new Date(snippet.publishedAt).toLocaleString();
    const videoId = item.snippet.videoId;

    box.innerHTML += `
      <div class="comment-item">
        <b>${author}</b> · <small>${publishedAt}</small><br>
        <a href="https://www.youtube.com/watch?v=${videoId}&lc=${item.id}" target="_blank">${text}</a>
      </div>
    `;
  });
}

// update automat număr abonați la fiecare 30 secunde
setInterval(loadChannelData, 30000);
