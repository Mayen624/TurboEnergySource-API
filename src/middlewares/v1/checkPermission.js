import roleShemma from "#models/v1/roles.js";

const CheckUserPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {

            if (!Array.isArray(requiredPermissions)) {
                return res.status(400).json({ error: 'Formato de permisos inválido' });
            }

            // Usar req.user que fue establecido por isAuthenticated
            if (!req.user || !req.user.roleId) {
                return res.status(403).json({ error: 'Información de rol no encontrada' });
            }

            // Buscar rol y popular acciones
            const userRole = await roleShemma.findById(req.user.roleId).populate('actions');

            if (!userRole || !userRole.enabled) {
                return res.status(403).json({ error: 'Rol no encontrado o deshabilitado' });
            }

            // Obtener nombres de acciones del usuario
            const userActions = userRole.actions.map(action => action.name);

            // Verificar que el usuario tenga TODOS los permisos requeridos
            const hasAllPermissions = requiredPermissions.every(permission => userActions.includes(permission));

            if (!hasAllPermissions) {
                return res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción' });
            }

            next();

        } catch (e) {
            return res.status(500).json({ error: 'Error al validar permisos: ' + e.message });
        }
    }
}

export { CheckUserPermission };