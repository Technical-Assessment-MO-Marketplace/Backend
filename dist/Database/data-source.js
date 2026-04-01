"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const config_1 = require("../config");
exports.AppDataSource = new typeorm_1.DataSource((0, config_1.getDatabaseConfig)());
//# sourceMappingURL=data-source.js.map