const express = require("express");
const policyRouter = express.Router();
const policyCtrl = require("../controllers/PolicyController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");


policyRouter.get("/get-all", policyCtrl.getPolicies);

policyRouter.put("/update", authMiddleware, adminChecker, policyCtrl.updatePolicies);

module.exports = policyRouter;