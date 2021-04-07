# Deploy to firebase hosting

### - Apply target

``
firebase target:apply hosting karen-hernandez-ginecologa karen-hernandez-ginecologa
``

### - Deploy to specific target

``
 firebase deploy --only hosting:karen-hernandez-ginecologa
 ``

 # Deploy Firebase Cloud Functions

 ``
 firebase deploy --only functions:app
 ``

 ## Set env vars

 firebase functions:config:set app.db_host="..."
 firebase functions:config:set app.db_user="..."

## Get env vars

firebase functions:config:get