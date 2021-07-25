exports.up = (pgm) => {
    pgm.createTable('auth', {
      token: {
        type: 'TEXT',
        notNull: true,
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('auth');
  };
  