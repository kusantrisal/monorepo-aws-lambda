# Step to set you the project locally
## 1. `npm install`  to set the frame work up
## 2. `npm run-script bootstrap` to get the packages ready
## 3. `npm run-script deploy --profile default` to deploy to aws. --profile is option if you want to deploy to diff account use this
## 4. `npm run-script clean`  to delete all node_modules and cdk.out
## 5. To create a module cd inside the packages and run `npm -y init' this will create a module

[Run lambda locally](https://github.com/lambci/docker-lambda#run-examples)

```
npm run-script run:locally
OR
docker run --rm -e DOCKER_LAMBDA_STAY_OPEN=1  -p 9001:9001 -v %CD%:/var/task:ro,delegated  lambci/lambda:nodejs12.x packages/handler/index.handler
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