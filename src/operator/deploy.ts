export default async function deploy(service: string) {
  return {
    success: true,
    message: `Deployment triggered for ${service}`
  };
}
