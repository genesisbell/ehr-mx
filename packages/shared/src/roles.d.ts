export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly DOCTOR: "DOCTOR";
    readonly NURSE: "NURSE";
    readonly RECEPTION: "RECEPTION";
};
export type Role = (typeof Role)[keyof typeof Role];
/** Roles that can create/sign clinical notes (NOM-004) */
export declare const CLINICAL_ROLES: Role[];
/** Roles with full system access */
export declare const ADMIN_ROLES: Role[];
//# sourceMappingURL=roles.d.ts.map