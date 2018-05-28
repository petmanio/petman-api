export const dtoGetter = function(dto) {
  return function () {
    return dto;
  };
};

export const getUserFbAvatarByFbId = (facebookId: string): string => {
  return `https://graph.facebook.com/${facebookId}/picture?type=normal`;
};

export const getFacebookById = (facebookId: string): string => {
  return `https://facebook.com/${facebookId}`;
};
