let news = [
  { id: 1, name: "VTS Launches New AI Module" },
  { id: 2, name: "Upcoming Live Coding Contest " },
  { id: 3, name: "New Masterclass UI/UX Goes Live " },
  { id: 4, name: "Placement Drive 2025: Registration Opens" },
  { id: 5, name: "DSA Bootcamp Receives Record Enrollments" },
];

export const fetchNews = () => {
  return Promise.resolve(news);
};

export const addNews = (name) => {
  const newNews = {
    id: Date.now(),
    name,
  };
  news = [...news, newNews];    
  return Promise.resolve(newNews);
};
