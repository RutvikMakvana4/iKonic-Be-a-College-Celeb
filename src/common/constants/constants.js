module.exports = {
  JWT: {
    SECRET: process.env.SECRETKEY,
    EXPIRES_IN: "1 YEAR"
  },
  BCRYPT: {
    SALT_ROUND: 12
  },

  STATUS: {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10
  },

  TYPE: {
    ZERO: 0,
    ONE: 1,
    TWO: 2
  },

  PAGINATION: {
    DEFAULT_PER_PAGE: 10,
    DEFAULT_PAGE: 1,
  },
};
