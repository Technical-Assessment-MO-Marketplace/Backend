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
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let TokenService = TokenService_1 = class TokenService {
    jwtService;
    logger = new common_1.Logger(TokenService_1.name);
    JWT_EXPIRATION = '24h';
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateToken(user) {
        try {
            const token = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role_id: user.role_id,
            }, { expiresIn: this.JWT_EXPIRATION });
            return token;
        }
        catch (error) {
            this.logger.error(`Token generation failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to generate token');
        }
    }
    validateTokenPayload(payload) {
        try {
            if (!payload || !payload.sub) {
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            return {
                userId: payload.sub,
                email: payload.email,
                roleId: payload.role_id,
            };
        }
        catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenService);
//# sourceMappingURL=token.service.js.map