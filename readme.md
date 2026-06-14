# chai and backend learing seris

# backend model link 
- [Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

# configuration setting

# work 3
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

# work 4
1. setup mongoDb atlas an get the connection string (setup port and URI in .env)
2. installed mongooes express and dotenv
3. we are using data base from another continent so data aane mei time lag stka use async await
also kuch error bhi so skta to try catch ya promises (.then .catch) use kro
4. we use iify to connect dbs ;(async()=>{})() - with a semicolon in front to avoid error like if last line doesn't have semicolon
so it will add to that line so we avoid it by adding semicolon in front (use try catch in the {})
5. we set up the mongoDb in databse dir in index.js (checkout)
6. As early as possible in your application,import and configure dotenv. (to import them we have to use them as an experimental thing - in dev script we have to add "nodemon -r dotenv/config --experimental-json-modules src/index.js")

# work 5
1. first we are exporting express and creating app commands
2. we install cookie-parser and cors (proxy lagana) - middlewares (app.use) use with it.
3. data comes from many sites so we are setting rules in app.js 
like setting the app.use cores origin to the url from which route the data is allowed 
read about cors and cookies in app.js code
4. middleware - checking between req and res, (like is someone open insta profile so he should get the profile details but we don't know the user is sign up or not so we use a checking in the middle called that)(or like check if user is admin) (err,req,res,next) (where next is a flag which middleware use)
5. now in src index.js file we have database connections (and database se bhot jagah baat krne wale hai)(so we set them into a utility pack)
6. we create one more utility to handle errors so that all the errors are in a standard formet
7. visit asynchandler apierros apires and see they are the functions or classes we have created to set the standed throughout the code,
if any time we have to send apierrors we use this util everywhere so that it give same formet of error in every issues of the code

# work 6
1. user and video model with hooks and JWT - we learn
2. first we only create models of user and video (can visit model link - also models) (avtar and cover img stored at third party - with url)
3. after finishing both model we need aggrigation pipeline (install from npm)(aggrigation pipeline framwork in mongodb.com)(npm i mongoose-aggregate-paginate-v2) (import and use in video.js)
4. now we come back to user.model we install bcrypt (for hassing - password)
second for tokens we download jsonwebtokens(jwt) (use for refresh tokens)
[it consist header, payload - encrypted data(like user id,email), varification signature - secret(protect)]
then we import them in user.model and use them (see there)
5. We set password encyption and then a functuon to match the password with the data 
also we did write the JWT function for access token and refresh tokens in .env and user.model file
6. must read user.model and video.model (contains explanations in terms of comment)

# work 7
1. today we learn about file uploading on the website (we made a utility function of file upload)
2. we use cloudinary to store files (images pdfs and files). and multer for uploding it into the code
3. first we take the file from user using multer and save it to local server then we use cloudinary and take the file from local server and upload it to servers. (we can direclty upload using cloudinary but above is production level code) 
4. set up cloudinary in .env file api details from the cloudinary website 
5. after setting up go and create a middleware with multer ("jaa rhe ho to milte hue jana") (jaha jaha file upload ki jarurat hogi waha waha multer ko inject kr denge) *(read multer git documentation)(uploaded a screenshot how multer inject and work as a middleware)

#
# About HTTP 
1. https://youtu.be/qgZiUvV41TI?si=ze8qG8IasNmgGS00 http crash course 

#
# Implimentation of backend

# work 1 
1. now we start defining controllers using async handler helper file. and then we go for. routes
2. now as the user type the url http:localhost8000/api/v1/users then our first file run index.js then it call for app.js and from app.js it uses middleware and it goes to user.route where we have already set and controller for registeration 