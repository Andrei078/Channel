const API_KEY = "AIzaSyDewiiHYIDNU8z-CQrF6_xru8bxbF0uNvY";
const CHANNEL_ID = "UCITHC5fLQJy8ufLyd78D7SA";

// Funcție pentru formatarea numerelor în stil YouTube
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
}

// Date despre canal
async function loadChannelData() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    console.error("Nu s-au găsit date pentru canal sau API Key-ul nu funcționează.");
    return;
  }

  const channel = data.items[0];
  document.getElementById("subs").innerText = formatNumber(channel.statistics.subscriberCount) + " abonați";
  document.getElementById("avatar").src = channel.snippet.thumbnails.high.url;
}

// Ultimul video
async function loadLatestVideo() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    console.error("Nu s-au găsit videoclipuri.");
    document.getElementById("latestVideo").innerHTML = "Nu există videoclipuri disponibile.";
    return;
  }

  const video = data.items.find(item => item.id.videoId);
  if (!video) return;

  const videoId = video.id.videoId;
  document.getElementById("latestVideo").innerHTML =
    `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  // Stats pentru video
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;
  const statsRes = await fetch(statsUrl);
  const statsData = await statsRes.json();
  const stats = statsData.items[0].statistics;

  document.getElementById("videoStats").innerHTML = `
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
        2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 
        2.09C13.09 4.01 14.76 3 16.5 
        3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
        6.86-8.55 11.54L12 21.35z"/>
      </svg> ${formatNumber(stats.likeCount || 0)}
    </div>

    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 
        16 5s-3 1.34-3 3 1.34 3 3 
        3zm-8 0c1.66 0 3-1.34 
        3-3S9.66 5 8 5 5 6.34 5 8s1.34 
        3 3 3zm0 2c-2.33 0-7 1.17-7 
        3.5V21h14v-4.5c0-2.33-4.67-3.5-7-3.5zm8 
        0c-.29 0-.62.02-.97.05 1.16.84 1.97 
        2.08 1.97 3.45V21h6v-4.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg> ${formatNumber(stats.viewCount || 0)}
    </div>

    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21 6h-2v9H7v2c0 
        .55.45 1 1 1h9l4 4V7c0-.55-.45-1-1-1zM17 
        2H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 
        1-1V3c0-.55-.45-1-1-1z"/>
      </svg> ${formatNumber(stats.commentCount || 0)}
    </div>
  `;
}

// Cel mai popular video
async function loadPopularVideo() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=viewCount&maxResults=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    console.error("Nu s-au găsit videoclipuri populare.");
    document.getElementById("popularVideo").innerHTML = "Nu există videoclipuri disponibile.";
    return;
  }

  const video = data.items.find(item => item.id.videoId);
  if (!video) return;

  const videoId = video.id.videoId;
  document.getElementById("popularVideo").innerHTML =
    `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  // Stats pentru popular video
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;
  const statsRes = await fetch(statsUrl);
  const statsData = await statsRes.json();
  const stats = statsData.items[0].statistics;

  document.getElementById("popularStats").innerHTML = `
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 
        12.28 2 8.5 2 5.42 4.42 3 7.5 
        3c1.74 0 3.41 1.01 4.5 
        2.09C13.09 4.01 14.76 3 16.5 
        3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
        6.86-8.55 11.54L12 21.35z"/>
      </svg> ${formatNumber(stats.likeCount || 0)}
    </div>

    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 
        16 5s-3 1.34-3 3 1.34 3 3 
        3zm-8 0c1.66 0 3-1.34 
        3-3S9.66 5 8 5 5 6.34 5 8s1.34 
        3 3 3zm0 2c-2.33 0-7 1.17-7 
        3.5V21h14v-4.5c0-2.33-4.67-3.5-7-3.5zm8 
        0c-.29 0-.62.02-.97.05 1.16.84 1.97 
        2.08 1.97 3.45V21h6v-4.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg> ${formatNumber(stats.viewCount || 0)}
    </div>

    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21 6h-2v9H7v2c0 
        .55.45 1 1 1h9l4 4V7c0-.55-.45-1-1-1zM17 
        2H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 
        1-1V3c0-.55-.45-1-1-1z"/>
      </svg> ${formatNumber(stats.commentCount || 0)}
    </div>
  `;
}

// Inițializare
loadChannelData();
loadLatestVideo();
loadPopularVideo();

// Reîmprospătare la 3 ore (10800000 ms)
setInterval(loadChannelData, 10800000);
setInterval(loadLatestVideo, 10800000);
setInterval(loadPopularVideo, 10800000);
