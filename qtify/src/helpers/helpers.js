export function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

const BASE_URL = "https://qtify-backend.labs.crio.do";

export const fetchTopAlbums = async () => {
  const response = await fetch(`${BASE_URL}/albums/top`);

  if (!response.ok) {
    throw new Error("Failed to fetch top albums");
  }

  return response.json();
};

export const fetchNewAlbums = async () => {
  const response = await fetch(`${BASE_URL}/albums/new`);

  if (!response.ok) {
    throw new Error("Failed to fetch new albums");
  }

  return response.json();
};