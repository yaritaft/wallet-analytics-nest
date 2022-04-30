import { hashSync, genSaltSync } from 'bcrypt-nodejs';
import { User } from 'src/entities/user.entity';

interface EncodedPassword {
  passwordHash: string;
  salt: string;
}

export const encodedPassword = async (
  password: string,
): Promise<EncodedPassword> => {
  if (!password) {
    throw new Error('Not valid password.');
  }
  const salt = await genSaltSync(10);
  const passwordHash = await hashSync(password, salt);
  return { passwordHash, salt };
};

export const checkSameHashedPassword = (
  attemptingPassword: string,
  userStored: User,
): boolean => {
  if (!attemptingPassword) {
    throw new Error('Not valid password.');
  }
  const hashedPassword = userStored.passwordHash;
  const hashedAttemptingPassword = hashSync(
    attemptingPassword,
    userStored.salt,
  );
  return hashedPassword === hashedAttemptingPassword;
};
