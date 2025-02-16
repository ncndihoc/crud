import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

//Type predicate for PrismaClientKnownRequestError

export function isUniqueConstraintPrismaError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === 'P2002'
  );
}

export function isNotFoundPrismaError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === 'P2005'
  );
}
