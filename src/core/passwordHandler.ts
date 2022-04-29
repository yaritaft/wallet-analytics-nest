import { hashSync, genSaltSync } from 'bcrypt-nodejs';
import { User } from 'src/entities/user.entity';

interface EncodedPassword {
  passwordHash: string;
  salt: string;
}

export const encodedPassword = async (
  password: string,
): Promise<EncodedPassword> => {
  const salt = await genSaltSync(10);
  const passwordHash = await hashSync(password, salt);
  return { passwordHash, salt };
};

export const checkSameHashedPassword = (
  attemptingPassword: string,
  userStored: User,
): boolean => {
  const hashedPassword = userStored.passwordHash;
  const hashedAttemptingPassword = hashSync(
    attemptingPassword,
    userStored.salt,
  );
  return hashedPassword === hashedAttemptingPassword;
};
