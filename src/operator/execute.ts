module.exports = async function executeCode(code) {
  try {
    const result = await eval(code);
    return { success: true, result };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
};
