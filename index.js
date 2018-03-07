const request = require("request");
const chalk = require("chalk");

const tvshows = ["siliconvalley", "mrrobot"];

module.exports = function(vorpal) {
  vorpal
    .command("epguides <tvshow>")
    .alias("ep")
    .autocomplete(tvshows)
    .description("Get next episode of your favorite tv shows")
    .action(function(args, callback) {
      const input = args.tvshow;

      const requestUrl = `http://epguides.frecar.no/show/${input}/next`;
      this.log(requestUrl);

      request.get(requestUrl, (error, response, body) => {
        if (error) {
          callback(error);
          return error;
        }
        body = JSON.parse(body);

        if (!body.episode) {
          const message = chalk.red("No result");
          callback(message);
          return message;
        }

        const episode = body.episode;

        const releaseDate = chalk.green(episode.release_date);
        const title = chalk.yellow(episode.title);

        const result = `${releaseDate}\t ${title}`;
        callback(result);
      });
    });
};

/*
  {"error": "Episode not found"}

  {"episode": {"number": 1, "release_date": "2017-04-23", "season": 4, "show": {"epguide_name": "siliconvalley", "imdb_id": "tt2575988", "title": "Silicon Valley"}, "title": "Episode 1"}}
 */
