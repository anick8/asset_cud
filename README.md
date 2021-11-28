# Hashx Asset CUD Microservice
Microservice to implement Asset Create Update and Delete operations.

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
 - req.body.BatchID : Batch number of asset
 - req.body.isPublic : Is public or not, default 1 ( Public )

Response Body -

res.data = {AssetUUID} 

Query : 
    'Insert into "Asset" ("AssetUUID","IdentityUUID","AssetName","CoverContentUUID","CreatedAt","Description","ModifiedAt","ReservePrice","isPublic","BatchID")

## /updateAssetDetails

Updates  Asset with new details : 

Request Body - 
- req.body.AssetName  : Name of Asset
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.CoverContentUUID : UUID of CoverContent from Content
- req.body.Description : Description of Created Asset
- req.body.ReservePrice : Price set for the Created Asset
 - req.body.BatchID : Batch number of asset
 - req.body.isPublic : Is public or not, default 1 ( Public )

 
Response Body -

res.data = {ModifiedAt} 

 
Query : 
'update "Asset" set "AssetName"=$2,"CoverContentUUID"=$3,"Description"=$4,"ModifiedAt"=$5,"isPublic"=$6,"BatchID"=$7 where "AssetUUID" = $1'


## /updateAssetReserve

Updates  Asset reserve price

Request Body - 
- req.body.AssetName  : Name of Asset
- req.body.AssetUUID : Unqiue UUID of Asset
- req.body.CoverContentUUID : UUID of CoverContent from Content
- req.body.Description : Description of Created Asset
- req.body.ReservePrice : Price set for the Created Asset
 - req.body.BatchID : Batch number of asset
 - req.body.isPublic : Is public or not, default 1 ( Public )

 
Response Body -

res.data = {ModifiedAt} 

 
Query : 
'update "Asset" set "ModifiedAt"=$2,"ReservePrice"=$3 where "AssetUUID" = $1'





## /deleteAsset

Deletes Asset row : 
Request Body - 
 - req.body.AssetUUID : Unique UUID of Asset
 

Response Body -

res.data = {AssetUUID} 


Query : 
- 'delete from "Asset" where "AssetUUID"=$1'



# Response Format

[err,data,msg]

 - err : Error message from SQL try block
 - data : Data returned by SQL query
 - msg : Custom message defined in API
