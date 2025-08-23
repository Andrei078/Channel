const API_KEY = "AIzaSyDoRAYTU4nqOhUcHjCRsMx23DkH82kAhf8";
const CHANNEL_ID = "UCITHC5fLQJy8ufLyd78D7SA";
const CLIENT_ID = "367641338219-nsvnfq0a34f9flgolsd6rtst2bg0usc2.apps.googleusercontent.com";

async function loadChannelData() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const channel = data.items[0];

  document.getElementById("subs").innerText = channel.statistics.subscriberCount + " abonați";
  document.getElementById("avatar").src = channel.snippet.thumbnails.high.url;
}

async function loadLatestVideo() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1`;
  const res = await fetch(url);
  const data = await res.json();
  const video = data.items.find(item => item.id.videoId);
  if (video) {
    const videoId = video.id.videoId;
    document.getElementById("latestVideo").innerHTML =
      `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    document.getElementById("latestVideo").innerHTML = "Nu există videoclipuri disponibile.";
  }
}

loadChannelData();
loadLatestVideo();
setInterval(loadChannelData, 30000);
