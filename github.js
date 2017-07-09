const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');

const url = 'https://api.github.com/users';

const getRepos = (username) => {
  const params = qs.stringify({
    per_page: 100
  });
  return axios({
    url: `${url}/${username}/repos?${params}`,
    method: 'get',
    responseType: 'json'
  });
};

const getStats = async (username) => {
  const repos = await getRepos(username);
  const languages = repos.data.map(r => r.language);
  const totalStars = repos.data.reduce((sum, r) =>
    (sum + parseInt(r.stargazers_count, 10)), 0);
  return {
    languages: _.uniq(languages).filter(l => l !== null),
    stars: totalStars
  };
};

module.exports = {
  getStats
};
