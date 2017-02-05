# TVB News 
A toy project to show [TVB News](http://news.tvb.com/).

>  Preview: http://118.193.168.209:9000 
 
## tech stacks
- Node.js
- Koa 1
- Mongodb
- Cronjob

## Get started

``` bash
# install dependencies
npm install

# start serve with hot reload for development at localhost:9000
npm start

# start serve for production(pls create the production config at /config/env)
pm2 start start_prod.json
```

## WEB UI
http://localhost:9000/

## API list
1. GET /v1/check
	- server health check
2. GET /v1/focus?skip=10&limit=10
	 - get the tvb news focus
3. GET /v1/live
	- get the tvb news live stream
4. GET /v1/pgm?skip=10&limit=10
	- get the list of programes 
5. GET /v1/pgm/:path
	- get all episodes detail by programme path, i.e. http://localhost:9000/v1/pgm/aiglepresentsbigbigworldiii
6. GET /v1/pull?action=[focus|live|pgm|pgmAll]
	- pull the data from http://news.tvb.com/
