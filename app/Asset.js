var pgsql = require('../lib/pgsql')
var hash = require('../lib/hash')
exports.createAsset = async (req) => {

        var IdentityUUID = req.body.IdentityUUID;
        var AssetName = req.body.AssetName || "";
        var CoverContentUUID = req.body.CoverContentUUID;
        var CreatedAt = Date.now();
        var ModifiedAt = Date.now();
        var AssetUUID = hash.hashing(AssetName,CreatedAt);
        var Description = req.body.Description|| "";
        var ReservePrice = req.body.ReservePrice|| 0;
        var isPublic = req.body.isPublic|| 1;
        var BatchID =   req.body.BatchID || 0;
        // var Content = req.body.Content;
        // var Identity = req.body.Identity;

        var qarg=[AssetUUID,IdentityUUID,AssetName,CoverContentUUID,CreatedAt,Description,ModifiedAt,ReservePrice,isPublic,BatchID];
        
        qname='Insert into "Asset" ("AssetUUID","IdentityUUID","AssetName","CoverContentUUID","CreatedAt","Description","ModifiedAt","ReservePrice","isPublic","BatchID") values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)' 
        try{
            result =await pgsql.conquery(qname,qarg)
            console.log(result.rowCount)
            if (result.rowCount == 1)
                data = {"AssetUUID":AssetUUID}
                return [null,data,"Successfully created Asset"]
        }
        catch(err)
        {
            return [err,null,"Error Creating Asset : "+err.detail]
        }

};

exports.updateAssetDetails = async (req) => {
    var AssetUUID = req.body.AssetUUID;
    var AssetName = req.body.AssetName;
    var CoverContentUUID = req.body.CoverContentUUID;
    var ModifiedAt = Date.now();
    var Description = req.body.Description;
    var isPublic = req.body.isPublic|| true;
    var BatchID =   req.body.BatchID || 0;
    var qarg=[AssetUUID,AssetName,CoverContentUUID,Description,ModifiedAt,isPublic,BatchID];
        qname='update "Asset" set "AssetName"=$2,"CoverContentUUID"=$3,"Description"=$4,"ModifiedAt"=$5,"isPublic"=$6,"BatchID"=$7 where "AssetUUID" = $1'
    try{
        result =await pgsql.conquery(qname,qarg)
        console.log(result.rowCount)
        if (result.rowCount == 1)
        {
            data ={"ModifiedAt":ModifiedAt}
            return [null,data,"Successfully updated Asset"]
        }
        else if(result.rowCount == 0){
            err ={"err":"AssetUUID does not exist"}
            return [err,null,"AssetUUID does not exist"]
        }
    }
    catch(err)
    {
        return [err,null,"Error updating Asset to the database :"+err.detail]
    }

};


exports.updateAssetReserve = async (req) => {
    var AssetUUID = req.body.AssetUUID;
    var ModifiedAt = Date.now();
    var ReservePrice = req.body.ReservePrice;
    var qarg=[AssetUUID,AssetName,CoverContentUUID,Description,ModifiedAt,ReservePrice];
        qname='update "Asset" set "ReservePrice"=$6 where "AssetUUID" = $1'
    try{
        result =await pgsql.conquery(qname,qarg)
        console.log(result.rowCount)
        if (result.rowCount == 1)
        {
            data ={"ModifiedAt":ModifiedAt}
            return [null,data,"Successfully updated Asset"]
        }
        else if(result.rowCount == 0){
            err ={"err":"AssetUUID does not exist"}
            return [err,null,"AssetUUID does not exist"]
        }
    }
    catch(err)
    {
        return [err,null,"Error updating Asset to the database :"+err.detail]
    }

};


exports.deleteAsset = async (req) => {
    var AssetUUID = req.body.AssetUUID;
    var qarg=[AssetUUID]
    qname='delete from "Asset" where "AssetUUID"= $1' 
    try{
        result =await pgsql.conquery(qname,qarg)
        if (result.rowCount == 1)
        {
            data = {"AssetUUID":AssetUUID}
            return [null,data,"Successfully deleted Asset"]
        }   
        else if(result.rowCount == 0)
        {
            err={'err':'Row does not exist'}
            return [err,null,"Asset for the AssetUUID does not exist"]
        }
    }
    catch(err)
    {
        console.log(err)
        return [err,null,"Error deleting from the database"]
    }

};

