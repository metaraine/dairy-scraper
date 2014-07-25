(function() {
  var DairyScraper, Event, cint, dairyScraper, fs, http, json5, _;

  http = require('q-io/http');

  fs = require('q-io/fs');

  json5 = require('json5');

  cint = require('cint');

  _ = require('underscore');

  Event = (function() {
    function Event(searchResultArrayStructure) {
      this.id = searchResultArrayStructure[0];
      this.description = searchResultArrayStructure[5];
      this.title = searchResultArrayStructure[6];
      this.time = searchResultArrayStructure[7].replace(/[ ]20\d\d/g, '');
      this.city = searchResultArrayStructure[27];
      this.venue = searchResultArrayStructure[29];
    }

    return Event;

  })();

  DairyScraper = (function() {
    function DairyScraper() {}

    DairyScraper.prototype.scrape = function(html) {
      var articleContext, articleContextEnd, articleContextEndSnippet, articleContextSnippet, articleContextStart, articleContextStartSnippet, events;
      articleContextStartSnippet = 'var articleContext = {';
      articleContextEndSnippet = 'createSearchMapping(articleContext);';
      articleContextStart = html.indexOf(articleContextStartSnippet) + articleContextStartSnippet.length - 1;
      articleContextEnd = html.indexOf(articleContextEndSnippet) - 3;
      articleContextSnippet = html.slice(articleContextStart, articleContextEnd);
      articleContext = json5.parse(articleContextSnippet.replace(/;\W*$/, ''));
      events = articleContext.searchResults.map(function(searchResult) {
        return new Event(searchResult);
      });
      return events[0].title + '\n' + _.pluck(events, 'time').join('\n');
    };

    DairyScraper.prototype.scrapePromisedContent = function(promisedHtml) {
      var self;
      self = this;
      return promisedHtml.fail(function(error) {
        return console.log('Error: ', error);
      }).then(function(html) {
        return console.log(self.scrape(html));
      }).done();
    };

    DairyScraper.prototype.scrapeHttp = function(url) {
      return this.scrapePromisedContent(http.read({
        url: url,
        charset: 'utf-8'
      }));
    };

    DairyScraper.prototype.scrapeFile = function(path) {
      return this.scrapePromisedContent(fs.read(path));
    };

    DairyScraper.prototype.runCommandLine = function() {
      var self, url;
      self = this;
      if (process.argv.length < 3) {
        console.log('You must specify a url');
        return process.exit(1);
      } else {
        url = process.argv[2];
        return self.scrapeHttp(url);
      }
    };

    return DairyScraper;

  })();

  dairyScraper = new DairyScraper;

  if (require.main === module) {
    dairyScraper.runCommandLine();
  } else {
    module.exports = dairyScraper;
  }

}).call(this);
