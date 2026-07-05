export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "supergirl";
}
