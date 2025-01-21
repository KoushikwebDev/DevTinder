const app = require("./src/app");

const config = require("./src/config/index");
const PORT = config.PORT || 3000;

const mongoose = require("mongoose");


(async () => {
    try {
     const response = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("DB Connected Successfully " + response.connection.host);
  
      app.on("error", (err) => {
        console.log("ERROR ", err);
        throw err;
      });
  
      const onListening = () => {
        console.log(`App is Running at ${PORT}`);
      };
      app.listen(config.PORT, onListening);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  })();