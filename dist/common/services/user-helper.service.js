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
var UserHelperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHelperService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/auth/entities/user.entity");
let UserHelperService = UserHelperService_1 = class UserHelperService {
    dataSource;
    userRepository;
    logger = new common_1.Logger(UserHelperService_1.name);
    ADMIN_ROLE_ID = 1;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.userRepository = this.dataSource.getRepository(user_entity_1.User);
    }
    async validateEmailUniqueness(email) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('User with this email already exists');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Email uniqueness validation failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to validate email');
        }
    }
    async verifyUserIsAdmin(userId) {
        try {
            const currentUser = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!currentUser) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (currentUser.role_id !== this.ADMIN_ROLE_ID) {
                throw new common_1.UnauthorizedException('Only admins can perform this action');
            }
            return currentUser;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Admin verification failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to verify admin status');
        }
    }
    async findUserByEmailWithRole(email) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                relations: ['role'],
            });
            return user || null;
        }
        catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`);
            throw new common_1.InternalServerErrorException('Database error');
        }
    }
    async createNewUser(name, email, hashedPassword, roleId) {
        try {
            const user = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                role_id: roleId,
            });
            const savedUser = await this.userRepository.save(user);
            return savedUser;
        }
        catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
};
exports.UserHelperService = UserHelperService;
exports.UserHelperService = UserHelperService = UserHelperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserHelperService);
//# sourceMappingURL=user-helper.service.js.map