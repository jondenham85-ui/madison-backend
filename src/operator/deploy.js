module.exports = async function deploy(service) {
  return {
    success: true,
    message: `Deployment triggered for ${service}`
  };
};
