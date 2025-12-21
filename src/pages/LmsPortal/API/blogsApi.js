let blogs = [
  { id: 1, name: "The Future of online Learning" },
  { id: 2, name: "Why Every Student Should Learn Coding" },
  { id: 3, name: "React vs Angular Which Should You Learn " },
  { id: 4, name: "Building Responsive Websites" },
  { id: 5, name: "Mastering DSA for Placements " },
];

export const fetchBlogs = () => {
  return Promise.resolve(blogs);
};

export const addBlogs = (name) => {
  const newBlogs = {
    id: Date.now(),
    name,
  };
  blogs = [...blogs, newBlogs];
  return Promise.resolve(newBlogs);
};
