<br />
<p align="center">
	<img src="https://www.argentapp.com//assets/img/logos/argent/logo-app.png" width="220">
</p>
<br />
##Application Programming Interface (API)

###Introduction

To get started with Running Argent you will need the following system configuration

Required dependencies

```.bash_profile``` environment variables + view hidden files
<br />
```defaults write com.apple.finder AppleShowAllFiles YES;```
<br />```killall Finder /System/Library/CoreServices/Finder.app```
<br /><br />Request the Argent local ```.bash_profile``` file from a Argent administrator

Other environment variables should shadow production/dev env variables on Heroku

- NodeJS (v.4.2.4)
- Bower
- Gulp
- Mongo express
- MongoDB
- Homebrew
- Nodemon 
- Docco 

```sudo npm i docco -g```
<br />```sudo npm i nodemon -g```

#####Do not do the following unless absolutely necessary, it give files root permissions for installs to run
```sudo chmod -R 0777 argent```  
```sudo chmod -R 0777 argent-api```  

Use Homebrew to install Mongo
<br />```ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```

Then
<br />```brew install mongodb```


####HOWTO: Create MongoDB instance to run API locally
```sudo mkdir -p data/db```  
```sudo chmod -R 0777 data/db```  
```sudo mongod --dbpath data/db```  
Check ```localhost:27017``` to see mongo running  
```mongo-express -u user -p password -d database``` 
<br />Check ```localhost:8081``` to see mongo database 


####HOWTO: Generate Documentation
```docco *.js```

Run ```nodemon server``` to instantiate API

API will now be running on ```http://localhost:5001```
<br />Local MongoDB will now be running on ```http://localhost:8081```
<br />Mongo Connection open on ```http://localhost:27017/{dbname}```

----------------------------------------------------

##Angular 1.3.8 User Interface (UI)

Run the following commands
<br />```sudo npm i bower -g```
<br />```sudo npm i gulp -g```
<br />```sudo npm i```
<br />```sudo bower i```

SASS
<br />```!important``` Fix for node-sass, lib-sass necessary
<br />```node sassdef``` Compile SASS files to CSS build files

Edit the following in ```src/app/index.js``` to match local settings
<br />
```
.value('appconfig',{
        apiRoot: 'http://localhost:5001'
})
```    
Run ```nodemon server``` to instantiate Angular frontend

App should now be running on ```http://localhost:5000```
<br />Requests will be made to the local API at ```http://localhost:5001```

----------------------------------------------------

##Staging and Deployment

------------------------------
###Heroku

Download Heroku Toolbelt
<br />https://toolbelt.heroku.com/osx

With Two-Factor Authentication
```heroku login``` and enter credentials

Add any domain endpoints necessary
<br />```heroku domains:add {mydomainname}```

Production Ready Checklist:
- Add MongoLab
- Add Expedited SSL
- Add SSL
- Add Librato
- Add Logentries
- Scale Dynos

Since our Heroku instance has two-factor authentication enabled you will need an app such as Google Authenticator to login

------------------------------
###Stripe

Be sure to have correct public key and sandbox keys
<br />https://dashboard.stripe.com

*The API Will configure the correct local development environment and production environment*
<br />The Angular frontend will require **configuring client key values in src/app/index.js**

------------------------------
###GitHub

https://help.github.com/articles/set-up-git/

In order to clone with two-factor authentication enabled you must set up an access token
<br /> https://github.com/settings/tokens > generate new token
<br /> Sign in using username and access token as password.

To commit to Github

```git branch {branchname}```
<br />```git add {files to commit}``` **ignore adding src/app/index.js unless absolutely necessary
<br />```git commit -m 'my commit'```
<br />```git push -u origin {branchname}```

To ensure identities for commits
<br />```git config user.name "{githubusername}"```
<br />```git config --global user.email "{your_email@example.com}"```

------------------------------
###BlueHost

In order to connect Heroku to a domain name server you will need to adjust the CNAME entry
- Remove currently existing www CNAME
- To do this add a new www CNAME pointing to ```http://{myapp}.herokuapp.com```
- This will now point the domain to the Heroku instance

Be sure to add a redirect rule (with or without www) to your app instance
- Non-Secured: Add redirect rule (with or without www) to ```http://www.{myapp}.com```
- Secured SSL: Add redirect rule (with or without www) to ```https://www.{myapp}.com```

In order to create a subdomain pointing to an API instance you will need to add a new CNAME Record
- Add CNAME Record api
- Point CNAME Record to ```https://{myapi}.herokuapp.com```

------------------------------
###SSL

To correctly provision the SSL it is recommended to use a service such as Expedited SSL
- Once the third-party SSL Service has been installed, edit your www CNAME to point to the SSL endpoint (e.g. ```https://floatingbreeze8293.herokuapp.com```)

------------------------------
###Docker

To run Docker you will need a Dockerfile

Run the following commands
<br />```docker build ./ -t <tag-name>```
<br />```docker run -it <tag-name>```

No cache build, run from scratch
<br />```docker build --no-cache ./ -t <tag-name>```

To inspect a container
# find ID of your running container:
<br />```docker ps -a ```

# create image (snapshot) from container filesystem
<br />```docker commit 12345678904b5 mysnapshot```

# explore this filesystem using bash (for example)
<br />```docker run -t -i mysnapshot /bin/bash```

# run it, use the container after building finished id
<br />```docker run -d -p 5000:5000 <enter-id-here>```

# stop all docker containers
<br />```docker stop $(docker ps -a -q)```

# remove all docker containers
<br />```docker rm $(docker ps -a -q)```

## DockerHub

# build for dockerhub
<br />```docker build ./ -t <hub-user>/<repo-name>```

# push to dockerhub
<br />```docker push <hub-user>/<repo-name>:<tag>```


# useful commands, see if the image and tag are available (1:yes, 0:no)
<br />```docker images | grep "app/website:latest" | wc -l```
<br />```docker images | grep "app/website:v1.1.5" | wc -l```

# For failed logins, restart machine and relogin.  Useful for new locations with Docker
<br />```docker-machine restart default```
<br />```docker login```

# deploy to aws
<br />http://victorlin.me/posts/2014/11/26/running-docker-with-aws-elastic-beanstalk

------------------------------
### OPENSSL

To create a base64 encoded password
openssl base64 -in "pass.txt" -out "base64.txt"
use this inside authentication json > docker/.dockercfg

------------------------------
###AWS DEPLOYMENT

EB Install Link
http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

Initialize
<br />```eb init```
<br />```eb create"```

Afterwards
<br />```eb deploy```

Fix npm install issue | run command last before bower install
<br />```env:
      "PATH": "/usr/bin"
  05_bower_install:
    command: "bower update --allow-root"```

------------------------------

###QUESTIONS?

For any questions please email [support](mailto:support@argent-tech.com)


