const bcrypt = require("bcryptjs")
const password = process.argv[2] || "513277"
bcrypt.hash(password, 12).then((hash) => {
  console.log("ADMIN_PASSWORD_HASH=" + hash)
})
