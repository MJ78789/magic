import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY");

const playlists = {
  podcast: "PLQoAlT0qGhnI",
  shorts: "PLKqhGfdCSo1A",
  videos: "PLZ7mOeT3II8E",
};

async function youtube(resource, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`YouTube API ${response.status}: ${await response.text()}`);
  return response.json();
}

async function playlistItems(category, playlistId) {
  const data = await youtube("playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: "50",
  });
  return (data.items || [])
    .filter(item => item.contentDetails?.videoId && item.snippet?.title !== "Deleted video" && item.snippet?.title !== "Private video")
    .map(item => ({
      id: item.contentDetails.videoId,
      category,
      title: item.snippet.title,
      description: item.snippet.description?.split("\n").find(Boolean)?.slice(0, 220) || "รับชมเนื้อหาจาก Magic Success Thailand",
      duration: "",
      publishedAt: item.contentDetails.videoPublishedAt || item.snippet.publishedAt,
      featured: true,
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
    }));
}

const groups = await Promise.all(Object.entries(playlists).map(([category, id]) => playlistItems(category, id)));
const output = {
  mode: "live",
  updatedAt: new Date().toISOString(),
  channelId: "UC4owSQOSWhEemcw0VkTCtVQ",
  channelUrl: "https://www.youtube.com/@magicsuccessthailand",
  playlists,
  items: groups.flat(),
};

await mkdir("data", { recursive: true });
await writeFile("data/videos.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(`Synced ${output.items.length} videos from ${Object.keys(playlists).length} playlists.`);
