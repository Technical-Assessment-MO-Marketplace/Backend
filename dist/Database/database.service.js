"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DatabaseService = class DatabaseService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        try {
            if (this.dataSource.isInitialized) {
                const options = this.dataSource.options;
                const dbName = options.database || 'mo_markrtplace';
                const dbHost = options.host || new URL(options.url).hostname;
                console.log('DATABASE CONNECTION SUCCESSFUL');
                console.log(`Database: ${dbName}`);
                console.log(`Host: ${dbHost}`);
                console.log(`Type: ${options.type}`);
                console.log(`SSL: ${options.ssl ? 'Enabled' : 'Disabled'}`);
                await this.runMigrations();
            }
        }
        catch (error) {
            console.error('DATABASE CONNECTION FAILED');
            console.error(error);
            process.exit(1);
        }
    }
    async runMigrations() {
        try {
            console.log('Running database migrations...\n');
            const migrations = await this.dataSource.runMigrations();
            if (migrations.length > 0) {
                console.log('Migrations executed successfully:');
                migrations.forEach((migration, index) => {
                    console.log(`   ${index + 1}. ${migration.name}`);
                });
            }
            else {
                console.log('No pending migrations to run.');
            }
        }
        catch (error) {
            console.error('MIGRATION FAILED');
            console.error(error);
            throw error;
        }
    }
    getDataSource() {
        return this.dataSource;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseService);
//# sourceMappingURL=database.service.js.map