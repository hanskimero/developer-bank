
let hash = require("crypto").createHash("SHA256").update("linnaDev").digest("hex");

let secret = require("crypto").randomBytes(128).toString("hex");

console.log(hash);
