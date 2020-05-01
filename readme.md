# Step to set the project locally
## 1. `npm install`  to set the frame work up
## 2. `npm run-script bootstrap` to get the packages ready
## 3. `npm run-script deploy --profile default` to deploy to aws. --profile is option if you want to deploy to diff account use this
## 4. `npm run-script clean`  to delete all node_modules and cdk.out
## 5. To create a module cd inside the packages and run `npm -y init' this will create a module

[Run lambda locally](https://github.com/lambci/docker-lambda#run-examples)

```
npm run-script run:locally:windows 
or 
npm run-script run:locally:mac
 ```
## POSTMAN 
### POST http://localhost:9001/2015-03-31/functions/myfunction/invocations
```
{
	"httpMethod":"GET",
	"path":"/health",
	"headers": {
		"Authorization" : "Bearer"
	}
}
```
```
{
	"httpMethod":"POST",
	"path":"/health",
	"headers": {
		"Authorization" : "Bearer"
	},
	"body": "{\"respone\":\"Hello from mock\"}"
}
```

### Zip current folder without creating subfolder 
```
zip -r -D zipped.zip *
```