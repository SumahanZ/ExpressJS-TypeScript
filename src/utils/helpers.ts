//password hasher
import bcrypt from "bcrypt";

const saltRounds = 10;
export async function hashPassword(password: string): Promise<string> {
  //generate the salt
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(
  originalPassword: string,
  hashedPassword: string
) {
  return bcrypt.compareSync(originalPassword, hashedPassword);
}
