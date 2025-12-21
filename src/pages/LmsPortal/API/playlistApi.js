let playlists = [
  { id: 1, name: "DSA Mastery" },
  { id: 2, name: "Java Programming Essentials" },
  { id: 3, name: "React Frontend Development" },
  { id: 4, name: "Machine Learning Basics" },
  { id: 5, name: "C++ with DSA" },
];

export const fetchPlaylists = () => {
  return Promise.resolve(playlists);
};

export const addPlaylist = (name) => {
  const newPlaylist = {
    id: Date.now(),
    name,
  };
  playlists = [...playlists, newPlaylist];
  return Promise.resolve(newPlaylist);
};
