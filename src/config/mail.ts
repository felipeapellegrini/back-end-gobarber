interface IMailConfig {
  driver: 'ethereal' | 'ses';
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal', // qual driver de e-mail vou utilizar em producao
} as IMailConfig;
