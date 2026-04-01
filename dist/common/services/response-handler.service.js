"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResponseHandlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandlerService = void 0;
const common_1 = require("@nestjs/common");
let ResponseHandlerService = ResponseHandlerService_1 = class ResponseHandlerService {
    logger = new common_1.Logger(ResponseHandlerService_1.name);
    formatUserResponse(token, user, role) {
        return {
            access_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role,
            },
        };
    }
    formatAdminCreationResponse(newAdmin) {
        return {
            id: newAdmin.id,
            email: newAdmin.email,
            role: 'admin',
            message: 'Admin created successfully',
        };
    }
    handleAuthError(error) {
        if (error instanceof common_1.BadRequestException ||
            error instanceof common_1.UnauthorizedException ||
            error instanceof common_1.InternalServerErrorException) {
            return error;
        }
        this.logger.error(`Unexpected auth error: ${error.message}`);
        return new common_1.InternalServerErrorException('An error occurred during authentication');
    }
};
exports.ResponseHandlerService = ResponseHandlerService;
exports.ResponseHandlerService = ResponseHandlerService = ResponseHandlerService_1 = __decorate([
    (0, common_1.Injectable)()
], ResponseHandlerService);
//# sourceMappingURL=response-handler.service.js.map