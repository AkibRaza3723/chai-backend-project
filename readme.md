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