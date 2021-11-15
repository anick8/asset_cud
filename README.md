# Hashx Password CUD Microservice
Microservice to implement Password Create Update and Delete operations.

Run using -

npm install

npm start (OR) node index.js

# Change Guide
Make changes

git add .

git commit -m "Message"

git push hashx 

# Routes

## /createAsset

Creates a new Asset :

Request Body - 
 - req.body.IdentityUUID : UUID of Identity from Identity 
 - req.body.AssetName  : Name of Asset
 - req.body.CoverContentUUID : UUID of CoverContent from Content
 - req.body.Description : Description of Created Asset
 - req.body.ReservePrice : Price set for the Created Asset
 
 *Optional Arguments 
 
Query : 
-'Insert into "Asset" ("AssetUUID","IdentityUUID","AssetName","CoverContentUUID","CreatedAt","Description","ModifiedAt","ReservePrice") values($1,$2,$3,$4,$5,$6,$7,$8)'

## /updatePassword

Updates  Password with new details : 

Request Body - 
- req.body.AssetName  : Name of Asset
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.CoverContentUUID : UUID of CoverContent from Content
- req.body.Description : Description of Created Asset
- req.body.ReservePrice : Price set for the Created Asset

 
 
Query : 
- qname='update "Asset" set "AssetName"=$2, "CoverContentUUID"=$3, "ModifiedAt"=$4, "Description"=$5, "ReservePrice"=$6  where "AssetUUID"=$1'  

## /deletePassword

Deletes Password row : 
Request Body - 
 - req.body.AssetUUID : Unique UUID of Asset
 
Query : 
- 'delete from "Asset" where "AssetUUID"=$1'



# Response Format

[err,data,msg]

 - err : Error message from SQL try block
 - data : Data returned by SQL query
 - msg : Custom message defined in API
