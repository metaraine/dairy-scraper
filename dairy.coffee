http =    require 'q-io/http'
fs =      require 'q-io/fs'
json5 =   require 'json5'
cint =    require 'cint'
_ =       require 'underscore'

# Represents a single event from articleContext.searchResults defined on the ticket page. The constructor parses a flat array of the data.
class Event
	constructor: (searchResultArrayStructure)->
		@id =          searchResultArrayStructure[0]
		@description = searchResultArrayStructure[5]
		@title =       searchResultArrayStructure[6]
		@time =        searchResultArrayStructure[7]
			.replace(/[ ]20\d\d/g, '') # strip the year
		@city =        searchResultArrayStructure[27]
		@venue =       searchResultArrayStructure[29]

# namespace
class DairyScraper

	# scrape the html from one of the event pages at tickets.thedairy.org. Returns an articleContext object with a lot of flat arrays of data
	scrape: (html)->

		articleContextStartSnippet = 'var articleContext = {'
		articleContextEndSnippet = 'createSearchMapping(articleContext);'
		articleContextStart = html.indexOf(articleContextStartSnippet) + articleContextStartSnippet.length - 1
		articleContextEnd = html.indexOf(articleContextEndSnippet) - 3
		articleContextSnippet = html.slice articleContextStart, articleContextEnd

		# parse the "relaxed" JSON and get rid of the trailing semicolon
		articleContext = json5.parse articleContextSnippet.replace(/;\W*$/, '')

		# convert the searchResults from arrays into Event objects
		# events = articleContext.searchResults.map cint.new.bind(null, Event)
		events = articleContext.searchResults.map (searchResult)->
			new Event(searchResult)

		# return the showtimes of the events
		events[0].title + '\n' + _.pluck(events,'time').join('\n')

	scrapePromisedContent: (promisedHtml)->
		self = @
		promisedHtml
			.fail((error)-> console.log 'Error: ', error)
			.then (html)->
				console.log self.scrape html
			.done()

	scrapeHttp: (url)->
		@scrapePromisedContent http.read(url: url, charset: 'utf-8')

	scrapeFile: (path)->
		@scrapePromisedContent fs.read(path)

	runCommandLine: ()->
		self = @
		if process.argv.length < 3
			console.log 'You must specify a url'
			process.exit(1)
		else
			url = process.argv[2]
			self.scrapeHttp url

# either run from the command line or export the module
dairyScraper = new DairyScraper
if require.main is module
	dairyScraper.runCommandLine()
	# dairyScraper.scrapeFile('./stand-clear.html')
else
	module.exports = dairyScraper
