[![DeepScan grade](https://deepscan.io/api/teams/8152/projects/11537/branches/172732/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8152&pid=11537&bid=172732)
# api-gateway-service
API Gateway for the Motum services to put everything under one umbrella

Steps to get it up and running:
- Specify environment variables, such as:
  - `PORT`: port on which REST authentication api will be available
  - `BIND_ADDRESS`: address to bind REST api socket to
  - `AUTH_SERVICE_URL`: url to the REST authentication service
  - `USER_SERVICE_URL`: url to the REST user service
  - `AUTH_VERIFICATION_SERVICE_URL`: url to the gRPC authentication service
- `yarn build`
- `yarn start`

Or after you add env variables use `yarn docker` to build docker image
