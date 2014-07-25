# dairy-scraper
> Scrape event times from tickets.thedairy.org


## Usage

```sh
node dairy.js "https://tickets.thedairy.org/online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=0D0E652A-B775-4F8B-970E-794943749EAF"
```

```js
dairy = require('./dairy.js')
console.log( dairy.scrapeHttp('https://tickets.thedairy.org/online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=0D0E652A-B775-4F8B-970E-794943749EAF') )
```

## Build

```sh
gulp
```

## License

ISC © [Raine Lourie](https://github.com/metaraine)
