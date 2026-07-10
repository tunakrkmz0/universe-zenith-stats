export function isAdminRequest(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  const passwordFromHeader = request.headers.get("x-admin-password");

  return passwordFromHeader === adminPassword;
}