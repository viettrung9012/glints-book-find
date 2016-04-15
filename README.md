# Glints Take-home Project
## Show me the books

Scrape programming languages books from first page of amazon search and display to user, filterable by programming language.

This project used **MongoDB + Nodejs + Express + React + Webpack** for development

## Author
Truong Viet Trung

## Build & Run
#### App
##### Requirement
Having a running Mongo instance, use ```mongod``` to run on local machine.

Mongo server connection is configurable in ```constants.js```, the default is ```mongodb://localhost:27017/glints-test```

##### Run
```
cd /path/to/project
npm install
npm start
```
Open `http://localhost:3000/` to view the app

**Note:** When server started for the first time it could take some time to scrape

#### Dev Mode
##### Requirement
To run in dev mode, have **browser-sync, gulp, nodemon** installed on local machine

##### Run
```
cd /path/to/project
npm install
npm run dev
```

## Current Issues
1. Scraping might not get all necessary data due to Amazon CAPTCHA
2. **No testing**
3. No optimization of assets (uglify, concatenation, etc.)
4. I'm quite doubtful on MongoDB, maybe should have used Postgres
5. Data stored in database is not normalized
6. No authentication or security implemented, which lead to issue 7 below
7. Only **R** in **CRUD** for DB API is implemented


## Packages used
### NPM
```
babel-loader - v6.2.4
babel-preset-es2015 - v6.6.0
babel-preset-react - v6.5.0
bluebird - v3.3.5
cheerio - v0.20.0
express - v4.13.4
jquery - v2.2.3
materialize-css - v0.97.6
mongoose - v4.4.12
react - v15.0.1
react-dom - v15.0.1
request - v2.71.0
webpack - v1.12.15
browser-sync - v2.12.2
concurrently - v2.0.0
gulp - v3.9.1
gulp-nodemon - v2.0.6
```
