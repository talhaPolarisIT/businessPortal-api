const bcrypt = require("bcryptjs");
const models = require("./models");

const SALT_ROUNDS = 10;

const growControllers = [
  {
    name: "Grow Controller 1",
    identifier: "AB87MHY76",
  },
  {
    name: `Druid's Garden - Grow Controller 1`,
    identifier: "CD87MHY77",
  },
  {
    name: `Druid's Garden - Grow Controller 2`,
    identifier: "ED87MHY78",
  },
  {
    name: `Druid's Garden - Grow Controller 3`,
    identifier: "FE87MHY79",
  },
];

const keys = [
  "AB87MHY76-API-123",
  "CD87MHY77-API-123",
  "ED87MHY78-API-123",
  "FE87MHY79-API-123",
];

const seed = async () => {
  for (let i = 0; i < growControllers.length; i++) {
    console.log("Identifier: ", growControllers[i].identifier);
    try {
      console.log("Identifier: ", growControllers[i].identifier);

      //   const gc = await models.grow_controller.findOne({ where: { identifier: growControllers[i].identifier } });
      //   if (!gc) {
      //     console.log('Creating Grow Controller: ', growControllers[i].identifier);
      //     gc = await models.grow_controller.create(growControllers[i]);
      //   }
      //   const apiKey = await models.api_key.findOne({ where: { growControllerId: gc.id } });
      //   if (!apiKey) {
      //     console.log('Creating API key for: ', gc.id);
      //     await models.api_key.create({ hashed: bcrypt.hashSync(keys[i], bcrypt.genSaltSync(SALT_ROUNDS)), growControllerId: gc.id });
      //   }
    } catch (e) {
      console.log("Error: ", e);
      return;
    }
  }
};

module.exports = seed;
