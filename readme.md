# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Ethereal para testar envios em ambiente dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- O link enviado por email para resetar senha deve expirar em 2h
- O usuário precisa confirmar a nova senha ao resetá-la;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha o usuário deve informar a senha antiga;
- O usuário precisa confirmar sua senha para atualizá-la;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O usuário deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser utilizadas em tempo real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados; [X]
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador; [X]
- O usuário deve poder listar os horários disponíveis em um dia específico de um prestador; [X]
- O usuário deve poder realizar um novo agendamento com um prestador; [X]

**RNF**

- A listagem de prestadores deve ser armazenada em cache;
- A listagem de serviços de um prestador deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente; [X]
- Os agendamentos devem estar disponíveis entre 8h e 18h; [X]
- O usuário não pode agendar em um horário já ocupado; [X]
- O usuário não pode agendar em um horário que já passou; [X]
- O usuário não pode agendar serviços consigo mesmo; [X]
- O usuário não pode agendar dois serviços ao mesmo tempo; [X]
