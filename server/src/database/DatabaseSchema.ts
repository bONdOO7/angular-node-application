import DatabaseService from './DatabaseService';

const database = new DatabaseService();

export const schema = () => {
  const sql_user = 'CREATE TABLE IF NOT EXISTS `users` (' +
    '`id` int(11) NOT NULL AUTO_INCREMENT,' +
    '`username` varchar(255) NOT NULL,' +
    '`password` varchar(255) NOT NULL,' +
    'PRIMARY KEY(`id`)' +
    ') ENGINE = InnoDB DEFAULT CHARSET = utf8';
  
  database.query(sql_user, null);
};
