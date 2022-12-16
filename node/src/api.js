// @ts-check

const fs = require('fs');

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

const DB_FILE_NAME = 'database.json';

/** @returns {Promise<Post[]>} */
const getPosts = async () => {
  const json = await fs.promises.readFile(DB_FILE_NAME, 'utf-8');
  console.log('🚀 ~ file: api.js:17 ~ getPosts ~ json', json);

  const result = JSON.parse(json).posts;
  console.log('🚀 ~ file: api.js:20 ~ getPosts ~ result', result);
  return result;
};

/** @param {Post[]} posts */
const updatePosts = async (posts) => {
  const content = {
    posts,
  };

  return fs.promises.writeFile(DB_FILE_NAME, JSON.stringify(content), 'utf-8');
};

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {"GET" | "POST"} method
 * @property {(matches: string[], body?: Object.<string, *>) => Promise<APIResponse>} callback
 */
/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1];
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not Fount',
        };
      }

      const posts = await getPosts();
      console.log('🚀 ~ file: api.js:61 ~ posts', posts);
      const post = posts.find((_post) => _post.id === postId);

      if (!post) {
        return {
          statusCode: 404,
          body: 'Not Fount',
        };
      }

      return {
        statusCode: 200,
        body: post,
      };
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Response Body is none.',
        };
      }

      const { title, content } = body;

      const newPost = {
        id: title.replace(/\s/g, '_'),
        title,
        content,
      };

      const posts = await getPosts();
      console.log('🚀 ~ file: api.js:100 ~ callback: ~ posts', posts);
      posts.push(newPost);
      updatePosts(posts);

      return {
        statusCode: 200,
        body: newPost,
      };
    },
  },
];

module.exports = {
  routes,
};
