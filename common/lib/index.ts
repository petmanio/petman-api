const dtoGetter = function(dto) {
  return function () {
    return dto;
  };
};

export { dtoGetter };
