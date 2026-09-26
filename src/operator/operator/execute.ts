export default async function executeCode(code: string) {
  try {
    const result = await eval(code);
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.toString() };
  }
}
