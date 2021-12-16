var pgsql = require('../lib/pgsql')
var utils = require('../common/utils')
var Asset = require('./Asset');
module.exports = (app, console) => {
//    var utils = require('../common/utils');

    app.post('/createAssetTransaction',async (req, res) => {
         result  = await Asset.createAssetTransaction(req);
         console.log(result)
         utils.handleresultdict(res,result)
        }
    )
    app.post('/updateAssetDetails',async (req, res) => {
        result  = await Asset.updateAssetDetails(req);
        utils.handleresult(res,result)
       }
    )
    app.post('/updateAssetTransaction',async (req, res) => {
        result  = await Asset.updateAssetTransaction(req);
        utils.handleresultdict(res,result)
       }
    )
    app.post('/deleteAssetTransaction',async (req, res) => {
        result  = await Asset.deleteAssetTransaction(req);
        utils.handleresultdict(res,result)
        }
    )

    console.log("Installing TOKEN Routes")
};
