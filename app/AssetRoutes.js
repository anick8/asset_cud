var pgsql = require('../lib/pgsql')
var utils = require('../common/utils')
var Asset = require('./Asset');
module.exports = (app, console) => {
//    var utils = require('../common/utils');

    app.post('/createAsset',async (req, res) => {
         result  = await Asset.createAsset(req);
         utils.handleresult(res,result)
        }
    )
    app.post('/updateAssetDetails',async (req, res) => {
        result  = await Asset.updateAssetDetails(req);
        utils.handleresult(res,result)
       }
    )
    app.post('/updateAssetReserve',async (req, res) => {
        result  = await Asset.updateAssetReserve(req);
        utils.handleresult(res,result)
       }
    )
    app.post('/deleteAsset',async (req, res) => {
        result  = await Asset.deleteAsset(req);
        utils.handleresult(res,result)
        }
    )

    console.log("Installing TOKEN Routes")
};
