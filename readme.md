# chai and backend learing seris

# backend model link 
- [Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

# lec 3
1. we create a public file then temp but we can't push them to them into git wihtout using gitkeep(empty file)
this empty file used to track and keep empty folder to the project
2. now we create gitignore file to keep the sensitive informations. now we have gitignore generators in chrome we use them 
and to by default save the ignored file in the gitignore (copy from there past here)
3. now we add .env to save sensitive information
4. all the work are in src folder (source folder). for systematic code (with files index.js app.js constant.js)
5. we use type module in place of common.js to use import commands. also add some scripts. 
6. add nodemon but as an development dependency (npm install --save-dev nodemon), it will not heavy the code at productions.
7. now we create directries in src (controllers - functionality)(db - database connections)(middlewares - codeinbetwn)
middlewares - cookies (models - schemas) (routes - tosetroutes) (utils - utility) utility - like file uploding from 
the user and mailing these commonly used functions are stored here 
8. we use prittier ndm mode because if we work on team someone might use semicolon someone not it create mess while pushing(dev dependency)
with pritter we have to add some files manually (.prettierrc - configuration) (read doc for doubts)

# lec 4
1. setup mongoDb atlas an get the connection string (setup port and URI in .env)
2. installed mongooes express and dotenv
3. we are using data base from another continent so data aane mei time lag stka use async await
also kuch error bhi so skta to try catch ya promises (.then .catch) use kro
4. we use iify to connect dbs ;(async()=>{})() - with a semicolon in front to avoid error like if last line doesn't have semicolon
so it will add to that line so we avoid it by adding semicolon in front (use try catch in the {})
5. we set up the mongoDb in databse dir in index.js (checkout)
6. As early as possible in your application,import and configure dotenv. (to import them we have to use them as an experimental thing - in dev script we have to add "nodemon -r dotenv/config --experimental-json-modules src/index.js")

# lec 5
1. first we are exporting express and creating app commands
2. we install cookie-parser and cors (proxy lagana) - middlewares (app.use) use with it.
3. data comes from many sites so we are setting rules in app.js 
like setting the app.use cores origin to the url from which route the data is allowed 
read about cors and cookies in app.js code
4. middleware - checking between req and res, (like is someone open insta profile so he should get the profile details but we don't know the user is sign up or not so we use a checking in the middle called that)(or like check if user is admin) (err,req,res,next) (where next is a flag which middleware use)
5. now in src index.js file we have database connections (and database se bhot jagah baat krne wale hai)(so we set them into a utility pack)
6. we create one more utility to handle errors so that all the errors are in a standard formet