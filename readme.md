## deploy to gcloud funtions

gcloud functions deploy helloHttp --runtime nodejs12 --trigger-http --allow-unauthenticated --env-vars-file .env.yaml

## remember to create .env.yaml file witn env vars, refer to example
