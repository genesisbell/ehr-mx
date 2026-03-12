"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = exports.CLINICAL_ROLES = exports.Role = void 0;
exports.Role = {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    NURSE: 'NURSE',
    RECEPTION: 'RECEPTION',
};
/** Roles that can create/sign clinical notes (NOM-004) */
exports.CLINICAL_ROLES = [exports.Role.DOCTOR, exports.Role.NURSE];
/** Roles with full system access */
exports.ADMIN_ROLES = [exports.Role.ADMIN];
//# sourceMappingURL=roles.js.map