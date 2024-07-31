export const isCommentUpdatedChecker = (createdAt: Date, updatedAt: Date) => {
  const createdTime = new Date(createdAt);
  const updatedAtTime = new Date(updatedAt);
  const timeDifference = updatedAtTime.getTime() - createdTime.getTime();
  return timeDifference > 0 ? true : false;
};
