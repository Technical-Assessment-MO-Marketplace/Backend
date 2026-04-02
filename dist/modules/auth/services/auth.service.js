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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../../common/services");
let AuthService = AuthService_1 = class AuthService {
    passwordService;
    tokenService;
    userHelperService;
    responseHandlerService;
    logger = new common_1.Logger(AuthService_1.name);
    USER_ROLE_ID = 2;
    ADMIN_ROLE_ID = 1;
    constructor(passwordService, tokenService, userHelperService, responseHandlerService) {
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.userHelperService = userHelperService;
        this.responseHandlerService = responseHandlerService;
    }
    async register(registerDto) {
        try {
            this.logger.log(`Attempting to register user with email: ${registerDto.email}`);
            const { name, email, password } = registerDto;
            await this.userHelperService.validateEmailUniqueness(email);
            const hashedPassword = await this.passwordService.hashPassword(password);
            const user = await this.userHelperService.createNewUser(name, email, hashedPassword, this.USER_ROLE_ID);
            const token = await this.tokenService.generateToken(user);
            this.logger.log(`User registered successfully: ${email}`);
            return this.responseHandlerService.formatUserResponse(token, user, 'user');
        }
        catch (error) {
            this.logger.error(`Registration failed for email ${registerDto.email}: ${error.message}`);
            throw this.responseHandlerService.handleAuthError(error);
        }
    }
    async login(loginDto) {
        try {
            this.logger.log(`Attempting login for email: ${loginDto.email}`);
            const { email, password } = loginDto;
            const user = await this.userHelperService.findUserByEmailWithRole(email);
            if (!user) {
                this.logger.warn(`Login failed: User not found for email ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.password) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            await this.passwordService.verifyPassword(password, user.password);
            const token = await this.tokenService.generateToken(user);
            this.logger.log(`User logged in successfully: ${email}`);
            return this.responseHandlerService.formatUserResponse(token, user, user.role?.name || 'user');
        }
        catch (error) {
            this.logger.error(`Login failed for email ${loginDto.email}: ${error.message}`);
            throw this.responseHandlerService.handleAuthError(error);
        }
    }
    async createAdmin(adminEmail, password, currentUserId) {
        try {
            this.logger.log(`Attempting to create admin: ${adminEmail} by user ${currentUserId}`);
            await this.userHelperService.verifyUserIsAdmin(currentUserId);
            await this.userHelperService.validateEmailUniqueness(adminEmail);
            const hashedPassword = await this.passwordService.hashPassword(password);
            const newAdmin = await this.userHelperService.createNewUser(adminEmail, adminEmail, hashedPassword, this.ADMIN_ROLE_ID);
            this.logger.log(`Admin created successfully: ${adminEmail}`);
            return this.responseHandlerService.formatAdminCreationResponse(newAdmin);
        }
        catch (error) {
            this.logger.error(`Failed to create admin ${adminEmail}: ${error.message}`);
            throw this.responseHandlerService.handleAuthError(error);
        }
    }
    validateToken(payload) {
        return this.tokenService.validateTokenPayload(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.PasswordService,
        services_1.TokenService,
        services_1.UserHelperService,
        services_1.ResponseHandlerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map